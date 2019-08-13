import { StockInfo }  from "./StockWebPartWebPart";

// Mock Stock Inforamtion Class
export class StockInfoClient {
    // Private Collection of Data
    private static items : StockInfo[] = [
      { Symbol : "MSFT",
        Name : "Microsoft",
        Date : "15/07/2019",
        Price : 138.83
      }
      ,
      { 
        Symbol : "GE",
        Name : "General Electric",
        Date : "15/07/2019",
        Price : 450.83
      }
      ,
      { Symbol : "BOEING",
      Name : "Boeing",
      Date : "15/07/2019",
      Price : 138.83
    }
    ,
    { 
      Symbol : "GOGL",
      Name : "GGoogle",
      Date : "15/07/2019",
      Price : 450.83
    }
    ];
  
    public static getItems() : Promise<StockInfo[]> {
      return new Promise<StockInfo[]>((resolve) => {
        // AJAX
        resolve(StockInfoClient.items);
      });
    }
  }