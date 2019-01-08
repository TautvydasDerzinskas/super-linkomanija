class SvgIconsService {
  get iconList() {
    return require('../../assets/vectors/list.svg');
  }

  get iconGrid() {
    return require('../../assets/vectors/grid.svg');
  }

  get iconDownload() {
    return require('../../assets/vectors/download.svg');
  }

  get iconMaleArrowUp() {
    return require('../../assets/vectors/male_arrow_up.svg');
  }

  get iconMaleArrowDown() {
    return require('../../assets/vectors/male_arrow_down.svg');
  }

  get iconProgress() {
    return require('../../assets/vectors/progress.svg');
  }

  get iconArrowsUp() {
    return require('../../assets/vectors/arrows_up.svg');
  }

  get iconFileSize() {
    return require('../../assets/vectors/file_size.svg');
  }

  get iconOpen() {
    return require('../../assets/vectors/open.svg');
  }

  get iconEye() {
    return require('../../assets/vectors/eye.svg');
  }

  get iconComments() {
    return require('../../assets/vectors/comments.svg');
  }

  get iconStar() {
    return require('../../assets/vectors/star.svg');
  }

  get iconLoading() {
    return require('../../assets/vectors/loading.svg');
  }
}

export default new SvgIconsService();
