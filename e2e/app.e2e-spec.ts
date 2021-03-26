import { Ng2StyleguidePage } from './app.po';

describe('ng2-styleguide App', function() {
  let page: Ng2StyleguidePage;

  beforeEach(() => {
    page = new Ng2StyleguidePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
