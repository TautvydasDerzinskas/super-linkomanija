import svgIconsService from '../../services/content/svg-icons.service';

import IContent from '../../interfaces/content';

import './styles/back-to-top.scss';

class ContentBackToTop implements IContent {
  private isVisible = false;

  public extendPageUserInterface() {
    const target = document.getElementsByTagName('body')[0];
    const backToTopButton = document.createElement('button');
    backToTopButton.setAttribute('class', 'back-to-top');
    backToTopButton.innerHTML = svgIconsService.iconArrowsUp;
    target.appendChild(backToTopButton);
  }

  public setupEventListeners() {
    window.addEventListener('scroll', this.calculateButtonAppearance.bind(this));
    this.calculateButtonAppearance();
    const backToTopButtonElement = document.getElementsByClassName('back-to-top')[0];
    backToTopButtonElement.addEventListener('click', this.scrollToTop.bind(this, 500));
  }

  public cleanUp() {
    document.getElementsByClassName('back-to-top')[0].remove();
    window.removeEventListener('scroll', this.calculateButtonAppearance);
  }

  private calculateButtonAppearance() {
    const backToTopButtonElement = document.getElementsByClassName('back-to-top')[0];

    const distanceScrolled = window.pageYOffset;
    const distanceFromTop = 200;

    if (!this.isVisible && distanceScrolled >= distanceFromTop) {
      backToTopButtonElement.classList.add('back-to-top--visible');
      this.isVisible = true;
    } else if (this.isVisible && distanceScrolled < distanceFromTop) {
      backToTopButtonElement.classList.remove('back-to-top--visible');
      this.isVisible = false;
    }
  }

  private scrollToTop(scrollDuration: number) {
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }
}

export default new ContentBackToTop();
