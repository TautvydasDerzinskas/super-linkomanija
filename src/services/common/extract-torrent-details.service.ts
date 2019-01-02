import apiService from './api.service';
import { LinkomanijaSelectors } from '../../enums';
import { ITorrentDetails, ITorrentCategory } from '../../interfaces/torrent';

class ExtractTorrentDetailsService {
  public generateTorrentDetailsObject(): Promise<ITorrentDetails[]> {
    return new Promise((resolve) => {
      const torrentDetails: ITorrentDetails[] = [];
      const titleColumns = document.querySelectorAll(LinkomanijaSelectors.TorrentTableTitleColumn);
      let promisesLeft = titleColumns.length;
      for (let i = 0, b = titleColumns.length; i < b; i += 1) {
        const rowElement  = titleColumns[i].parentElement;
        const categoryColumnElement = rowElement.children[0];
        const titleColumnElement = rowElement.children[1];
        const filesColumnElement = rowElement.children[2];
        const commentsColumnElement = rowElement.children[3];
        const dateColumnElement = rowElement.children[4];
        const sizeColumnElement = rowElement.children[5];
        const downloadsColumnElement = rowElement.children[6];
        const seedersColumnElement = rowElement.children[7];
        const leechersColumnElement = rowElement.children[8];

        const isNew = titleColumnElement.children[1].nodeName.toLowerCase() === 'b';
        if (isNew) {
          titleColumnElement.children[1].remove();
        }

        const torrentDetail: ITorrentDetails = {
          id: this.getId(titleColumnElement),
          title: this.getTitle(titleColumnElement),
          subTitle: this.getSubTitle(titleColumnElement),
          detailsLink: this.getDetailsLink(titleColumnElement),
          torrentLink: this.getTorrentLink(titleColumnElement),
          isNew: isNew,
          isFavourite: this.getIfIsFavourite(titleColumnElement),
          category: this.getCategoryDetails(categoryColumnElement),
          filesCount: this.getFilesCount(filesColumnElement),
          commentsCount: this.getCommentsCount(commentsColumnElement),
          addedDate: this.getAddedDate(dateColumnElement),
          size: this.getSize(sizeColumnElement),
          downloadedTimes: this.getDownloadedCount(downloadsColumnElement),
          seedersCount: this.getSeedersCount(seedersColumnElement),
          leechersCount: this.getLeechersCount(leechersColumnElement),
          descriptionHtml: null,
        };

        apiService.getTorrentDescription(torrentDetail.detailsLink).then((descriptionHtml: string) => {
          torrentDetail.descriptionHtml = descriptionHtml;
          torrentDetail.imageLinks = this.exractImagesFromHtmlString(descriptionHtml);
          torrentDetails[i] = torrentDetail;

          promisesLeft--;

          if (promisesLeft === 0) {
            resolve(torrentDetails);
          }
        });
      }
    });
  }

  private exractImagesFromHtmlString(htmlCode: string) {
    const regex = new RegExp('<img .*?src="(.*?)"', 'gi');
    let result;
    const imageUrls = [];
    while ((result = regex.exec(htmlCode))) {
      imageUrls.push(result[1]);
    }
    return imageUrls;
  }

  private getId(titleColumnElement: Element) {
    const torrentLink = titleColumnElement.children[0].getAttribute('href');
    return parseInt(torrentLink.split('?')[1].split('.')[0], 10);
  }

  private getTitle(titleColumnElement: Element) {
    return titleColumnElement.children[0].children[0].textContent;
  }

  private getSubTitle(titleColumnElement: Element) {
    return titleColumnElement.children[6].textContent;
  }

  private getDetailsLink(titleColumnElement: Element) {
    return titleColumnElement.children[0].getAttribute('href');
  }

  private getTorrentLink(titleColumnElement: Element) {
    return titleColumnElement.children[1].getAttribute('href');
  }

  private getIfIsFavourite(titleColumnElement: Element) {
    return (<HTMLElement>titleColumnElement.children[3]).style.display === 'none';
  }

  private getFilesCount(filesColumnElement: Element) {
    return parseInt(filesColumnElement.children[0].children[0].textContent.replace(',', ''), 10);
  }

  private getCommentsCount(commentsColumnElement: Element) {
    return parseInt(commentsColumnElement.textContent.replace(',', ''), 10);
  }

  private getAddedDate(dateColumnElement: Element) {
    return dateColumnElement.children[0].childNodes[0].textContent + ' ' + dateColumnElement.children[0].childNodes[2].textContent;
  }

  private getSize(sizeColumnElement: Element) {
    return sizeColumnElement.textContent;
  }

  private getDownloadedCount(downloadedColumnElement: Element) {
    return parseInt(downloadedColumnElement.textContent.replace(',', ''), 10);
  }

  private getSeedersCount(seedersColumnElement: Element) {
    return parseInt(seedersColumnElement.textContent.replace(',', ''), 10);
  }

  private getLeechersCount(leechersColumnElement: Element) {
    return parseInt(leechersColumnElement.textContent.replace(',', ''), 10);
  }

  private getCategoryDetails(categoryColumnElement: Element): ITorrentCategory {
    return {
      title: categoryColumnElement.children[0].children[0].getAttribute('title'),
      link: categoryColumnElement.children[0].getAttribute('href'),
      imageLink: categoryColumnElement.children[0].children[0].getAttribute('src'),
    };
  }
}

export default new ExtractTorrentDetailsService();
