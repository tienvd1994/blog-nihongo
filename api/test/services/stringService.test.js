const StringService = require('../../src/services/stringService');

test('convert Vietnamese to English', () => {
    expect(StringService.convertViToEn('Việt Nam')).toBe('viet nam');
});

test('get Url friendly from String', () => {
    expect(StringService.getUrlFriendlyString('Nghệ thuật chăm sóc khách hàng   ')).toBe('nghe-thuat-cham-soc-khach-hang');
});


test('escape danger characters', () => {
    expect(StringService.stripHtmlTag('function() {{}}')).toBe('function&#40;&#41; &#123;&#123;&#125;&#125;');
});