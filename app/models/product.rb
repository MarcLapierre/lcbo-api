class Product < ActiveRecord::Base
  include PgSearch

  enum data_source: [
    :api,
    :lcbo
  ]

  pg_search_scope :search,
    against:  :tags,
    ignoring: :accents,
    using: {
      tsearch: {
        prefix: true,
        tsvector_column: :tag_vectors
      }
    }

  belongs_to :crawl
  belongs_to :producer

  has_many :inventories

  after_create :associate_producer!
  after_save :associate_categories!

  scope :by_ids, ->(*raw_ids) {
    ids   = raw_ids.flatten.map(&:to_i)
    scope = where(id: ids)

    if ids.empty?
      scope
    else
      sql = ids.each_with_index.map { |id, i| "WHEN #{id} THEN #{i}" }.join(' ')
      scope.order("CASE products.id #{sql} END")
    end
  }

  def categories
    @categories ||= begin
      if (ids = category_ids).any?
        Category.by_ids(ids).load
      else
        []
      end
    end
  end

  def associate_categories!
    names = [
      primary_category,
      secondary_category,
      tertiary_category
    ].reject(&:blank?)

    cats = if names[0]
      Category.fetch_by_lcbo_cat_names(names)
    else
      []
    end

    if cats.empty?
      update_column :category, nil
    else
      update_column :category, cats.map(&:name).join(', ')
    end

    return if category_ids == (ids = cats.map(&:id))

    update_column :category_ids, ids
  end

  def associate_producer!
    return true if producer_name.blank?
    return true if producer_id.present?
    producer = Producer.fetch_by_lcbo_name(producer_name)
    update_column :producer_id, producer.id
  end

  def self.place(attrs)
    attrs[:updated_at] = Time.now.utc
    attrs[:tags]       = attrs[:tags].any? ? attrs[:tags].join(' ') : nil
    attrs[:is_dead]    = false

    if (upc = attrs[:upc]).present?
      attrs[:upc] = normalize_isn(upc)
    else
      attrs.delete(:upc)
    end

    if (scc = attrs[:scc]).present?
      attrs[:scc] = normalize_isn(scc)
    else
      attrs.delete(:scc)
    end

    if 0 == where(id: attrs[:id]).update_all(attrs)
      create!(attrs)
    end
  end
end
