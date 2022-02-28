
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Model
{
    public class PageParams
    {
        const int maxPageSize = 50;
        public string SearchName {get; set;} = null;
        public string FilterState {get; set;} = null;
        public string FilterCategory {get; set;} = null;
        public string LocationUser { get; set; } = null;
        public DateTime FilterDate { get;set;} = new DateTime(0);

        public Guid? filterUserId { get; set; } = null;

        public string FilterTypeUser { get; set;} = null;
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 10;
        public int PageSize
        {
            get
            {
                return _pageSize;
            }
            set
            {
                _pageSize = (value > maxPageSize) ? maxPageSize : value;
            }
        }
    }
}
