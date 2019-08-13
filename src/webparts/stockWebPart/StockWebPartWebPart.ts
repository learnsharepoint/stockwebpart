import { Version } from '@microsoft/sp-core-library';
import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';

import { escape } from '@microsoft/sp-lodash-subset';

import styles from './StockWebPartWebPart.module.scss';
import * as strings from 'StockWebPartWebPartStrings';

import { StockInfoClient } from "./StockInfoClient";

export interface IStockWebPartWebPartProps {
  description: string;
}

export interface StockInfo {
    Symbol : string;
    Name : string;
    Date : string;
    Price : number;
}

export interface StockList {
  data : StockInfo[];
}

export default class StockWebPartWebPart extends BaseClientSideWebPart<IStockWebPartWebPartProps> {
  private listURL : string = "https://mindsharein.sharepoint.com/_api/Lists/GetByTitle('Stocks')/Items";

   // Live Data from list
  private getStockListData() : Promise<StockList> {
    return this.context.spHttpClient.get(this.listURL, SPHttpClient.configurations.v1)
      .then((response : SPHttpClientResponse) => {
          return response.json();
      });
  }

  // Getting dummy data from an array
  private getStockList() : Promise<StockList> {
    return StockInfoClient.getItems()
      .then((list: StockInfo[]) => {
        var info : StockList = { data : list };
        return info;
      }) as Promise<StockList>;
  }

  private renderDataAsync() : void {
    this.getStockListData().then((allstocks) => {
      this.renderStockList(allstocks.data);
    });
  }

  // Builds the HTML and inject into the page DOM
  private renderStockList(items: StockInfo[]): void {
    let html : string = "";

    items.forEach( (item : StockInfo) => {
      html += `<ul class="${styles.list}>
                  <li class="${styles.listItem}">
                    <span>${item.Symbol}</span>
                    <span>${item.Name}</span>
                    <span>${item.Price}</span>
                    <span>${item.Date}</span>
                  </li>
              </ul>`;
    });

    this.domElement.querySelector("#stockInfoContainer").innerHTML = html;
  }
  
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.stockWebPart }">
        <div class="${ styles.container }">
          <div id="stockInfoContainer"></div>
        </div>
      </div>`;

      // Fetch the Stock Info and Render
      this.renderDataAsync();

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  public doSomething<T>(arg: T) : T {
    var x : T;

    x = arg;
    
    // x.coefficient++; x.variance+=90; x.limits=20;
    // x.runAnalysis();

    return x;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
