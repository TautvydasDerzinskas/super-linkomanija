import svgIconsService from '../../services/content/svg-icons.service';

import IContent from '../../interfaces/content';

import { SvgIcons } from '../../enums';

import './styles/back-to-top.scss';

class ContentBackToTop implements IContent {
  private isVisible = false;

  public extendPageUserInterface() {
    const target = document.getElementsByTagName('body')[0];
    const backToTopButton = document.createElement('button');
    backToTopButton.setAttribute('class', 'back-to-top');
    backToTopButton.innerHTML = svgIconsService.getIcon(SvgIcons.ArrowsTop);
    target.appendChild(backToTopButton);
  }

  public setupEventListeners() {
    window.addEventListener('scroll', this.calculateButtonAppearance.bind(this));
    this.calculateButtonAppearance();
    const backToTopButtonElement = document.getElementsByClassName('back-to-top')[0];
    backToTopButtonElement.addEventListener('click', this.scrollToTop);
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

  private scrollToTop() {
    if (window.pageYOffset > 0) {
      window.scrollTo(0, 0);
    }
  }
}

export default new ContentBackToTop();
