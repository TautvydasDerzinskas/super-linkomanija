import apiService from './api.service';
import { LinkomanijaSelectors } from '../../enums';
import { IBasicReleaseDetails, IReleaseDetails, IReleaseCategory, IReleaseComment } from '../../interfaces/release';

class ExtractReleaseDetailsService {
  public generateMultipleReleasesData(customDocument?: Document): Promise<IReleaseDetails[]> {
    return new Promise((resolve) => {
      const releaseDetails: IReleaseDetails[] = [];
      const titleColumns = (customDocument || document).querySelectorAll(LinkomanijaSelectors.ReleaseTableTitleColumn);
      let promisesLeft = titleColumns.length;
      for (let i = 0, b = titleColumns.length; i < b; i += 1) {
        const releaseDetail = this.getMainReleaseDetails(titleColumns[i].parentElement as HTMLElement);

        apiService.getReleaseDetails(releaseDetail.detailsLink).then((data: { descriptionHtml: string, comments: IReleaseComment[] }) => {
          releaseDetail.descriptionHtml = data.descriptionHtml;
          releaseDetail.comments = data.comments;
          releaseDetail.imageLinks = this.exractImagesFromHtmlString(data.descriptionHtml);
          releaseDetails[i] = releaseDetail;

          promisesLeft--;

          if (promisesLeft === 0) {
            resolve(releaseDetails);
          }
        });
      }
    });
  }

  public getBasicReleaseDetailsInDetailsPage(): IBasicReleaseDetails {
    const cagegoryImage = document.querySelector('#content tr:not(.rowhead) td > img');
    const releaseId = parseInt(window.location.href.split('details?')[1].split('.')[0], 10);
    return {
      id: releaseId,
      title: document.querySelector('#content h1').textContent,
      category: {
        imageLink: cagegoryImage.getAttribute('src'),
      },
    };
  }

  public getBasicReleaseDetails(rowElement: HTMLElement): IBasicReleaseDetails {
    const categoryColumnElement = rowElement.children[0];
    const titleColumnElement = rowElement.children[1];

    return {
      id: this.getId(titleColumnElement),
      title: this.getTitle(titleColumnElement),
      category: this.getCategoryDetails(categoryColumnElement),
    };
  }

  public getMainReleaseDetails(rowElement: HTMLElement): IReleaseDetails {
    const categoryColumnElement = rowElement.children[0];
    const titleColumnElement = rowElement.children[1];
    const filesColumnElement = rowElement.children[2];
    const commentsColumnElement = rowElement.children[3];
    const dateColumnElement = rowElement.children[4];
    const sizeColumnElement = rowElement.children[5];
    const downloadsColumnElement = rowElement.children[6];
    const seedersColumnElement = rowElement.children[7];
    const leechersColumnElement = rowElement.children[8];

    return {
      id: this.getId(titleColumnElement),
      title: this.getTitle(titleColumnElement),
      subTitle: this.getSubTitle(titleColumnElement),
      detailsLink: this.getDetailsLink(titleColumnElement),
      downloadLink: this.getReleaseLink(titleColumnElement),
      isNew: this.getIfIsNew(titleColumnElement),
      isFavourite: this.getIfIsFavourite(titleColumnElement),
      isFreeLeech: this.getIfIsFreeLeech(titleColumnElement),
      category: this.getCategoryDetails(categoryColumnElement),
      filesCount: this.getFilesCount(filesColumnElement),
      commentsCount: this.getCommentsCount(commentsColumnElement),
      addedDate: this.getAddedDate(dateColumnElement),
      size: this.getSize(sizeColumnElement),
      downloadedTimes: this.getDownloadedCount(downloadsColumnElement),
      seedersCount: this.getSeedersCount(seedersColumnElement),
      leechersCount: this.getLeechersCount(leechersColumnElement),
    };
  }

  public getMainReleaseDetailsByDownloadLink(downloadLink: string) {
    const titleColumns = document.querySelectorAll(LinkomanijaSelectors.ReleaseTableTitleColumn);
    for (let i = 0, b = titleColumns.length; i < b; i += 1) {
      const rowDownloadLink = this.getReleaseLink(titleColumns[i]);

      if (rowDownloadLink.toLowerCase() === downloadLink.toLowerCase()) {
        return this.getBasicReleaseDetails(titleColumns[i].parentElement as HTMLElement);
      }
    }
  }

  public extractComments(releasePageHtml: string) {
    const parser = new DOMParser();
    const virtualDom = parser.parseFromString(releasePageHtml, 'text/html');
    const comments: IReleaseComment[] = [];
    const commentElements = virtualDom.getElementsByClassName('comment');

    for (let i = 0, b = commentElements.length; i < b; i++) {
      const name = commentElements[i].querySelector('.comment-user a').textContent;
      const id = commentElements[i].querySelector('.comment-user a').getAttribute('href').split('=')[1];
      const imageLink = commentElements[i].getElementsByClassName('comment-avatarimg')[0].getAttribute('src');
      const rating = commentElements[i].getElementsByClassName('comment-balance')[0].textContent;
      const message = commentElements[i].getElementsByClassName('comment-text')[0].textContent;

      const comment: IReleaseComment = {
        author: {
          name,
          id: parseInt(id, 10),
          imageLink,
          title: null,
        },
        message,
        rating,
      };

      comments.push(comment);
    }

    return comments;
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
    const downloadLink = titleColumnElement.children[0].getAttribute('href');
    return parseInt(downloadLink.split('?')[1].split('.')[0], 10);
  }

  private getTitle(titleColumnElement: Element) {
    return titleColumnElement.children[0].children[0].textContent;
  }

  private getSubTitle(titleColumnElement: Element) {
    return titleColumnElement.children[(titleColumnElement.children.length - 1)].textContent;
  }

  private getDetailsLink(titleColumnElement: Element) {
    return titleColumnElement.children[0].getAttribute('href');
  }

  private getReleaseLink(titleColumnElement: Element) {
    return titleColumnElement.children[(titleColumnElement.children.length - 6)].getAttribute('href');
  }

  private getIfIsNew(titleColumnElement: Element) {
    return titleColumnElement.children[1].nodeName.toLowerCase() === 'b' ||
           titleColumnElement.children[2].nodeName.toLowerCase() === 'b';
  }

  private getIfIsFavourite(titleColumnElement: Element) {
    return (<HTMLElement>titleColumnElement.children[(titleColumnElement.children.length - 5)]).style.display === 'none';
  }

  private getIfIsFreeLeech(titleColumnElement: Element) {
    return (<HTMLElement>titleColumnElement.children[1]).getAttribute('href') === 'faq.php#stat9' ||
           (<HTMLElement>titleColumnElement.children[2]).getAttribute('href') === 'faq.php#stat9';
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

  private getCategoryDetails(categoryColumnElement: Element): IReleaseCategory {
    return {
      title: categoryColumnElement.children[0].children[0].getAttribute('title'),
      link: categoryColumnElement.children[0].getAttribute('href'),
      imageLink: categoryColumnElement.children[0].children[0].getAttribute('src'),
    };
  }
}

export default new ExtractReleaseDetailsService();
