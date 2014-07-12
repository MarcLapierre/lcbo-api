require 'excon'
require 'nokogiri'

module LCBO
  class CatalogProductIdsCrawler
    PER        = 50 # 50 is the max
    A_ID_PART  = /\/([0-9]+)\Z/
    URL        = "http://www.lcbo.com/webapp/wcs/stores/servlet/CategoryNavigationResultsView?pageSize=#{PER}&manufacturer=&searchType=&resultCatEntryType=&catalogId=10001&categoryId=&langId=-1&pageName=&storeId=10151&sType=SimpleSearch&filterFacet=&metaData="

    DATA = {
      contentBeginIndex: 0,
      productBeginIndex: 0,
      beginIndex: 0,
      orderBy: '',
      isHistory: 'false',
      categoryPath: '//',
      pageView: '',
      resultType: 'products',
      orderByContent: '',
      searchTerm: '',
      facet: '',
      minPrice: '',
      maxPrice: '',
      storeId: '10151',
      catalogId: '10001',
      langId: '-1',
      fromPage: '',
      objectId: '',
      requesttype: 'ajax'
    }

    HEADERS = {
      'Origin'           => 'http://www.lcbo.com',
      'Content-Type'     => 'application/x-www-form-urlencoded',
      'X-Requested-With' => 'XMLHttpRequest',
      'Referer'          => 'http://www.lcbo.com/lcbo/search?searchTerm=',
      'User-Agent'       => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.103 Safari/537.36'
    }

    attr_reader :links, :page, :total

    def self.crawl
      puts 'Crawling product catalog...'
      crawler = new
      crawler.crawl
      puts
      crawler
    end

    def initialize
      @links = []
      @page  = 1
      @total = nil
    end

    def crawl_page!
      index  = (page * PER) - PER
      data   = DATA.merge(beginIndex: index, productBeginIndex: index)
      params = URI.encode_www_form(data),
      resp   = Excon.post(URL, body: params, headers: HEADERS)
      doc    = Nokogiri::HTML(resp.body)

      links = doc.css('.products > .product .product-name a').map { |a|
        a[:href].strip
      }

      @total ||= doc.css('.results-count .count')[0].content.to_i
      @links.concat(links)
    end

    def dot
      STDOUT.print('.')
      STDOUT.flush
    end

    def increment_page!
      @page += 1
    end

    def crawl
      loop do
        crawl_page!
        dot
        increment_page!

        break if (page * PER) > total
      end
    end
  end
end
