import sinon from 'sinon';
import assert from 'assert';
import { open, addQuery } from '../src';

const legend = global.legend = {
  call() {},
  navigateTo() {},
};

before(() => {
  sinon.replace(legend, 'call', sinon.fake());
  sinon.replace(legend, 'navigateTo', sinon.fake());
});

after(() => {
  sinon.restore();
});

describe('url-opener', () => {
  describe('#open()', () => {
    // edge cases
    it('URL 未传入，则二者都不调用', () => {
      const url = '';

      open(url);

      assert(!legend.call.called);
      assert(!legend.navigateTo.called);
    });

    // normal cases
    it("使用 `legend.call('startApp')` 打开 H5 离线包应用（充值中心）", () => {
      const url = 'https://www.example.com/';
      const expectedUrl = 'https://www.example.com/';

      open(url);

      assert(legend.call.calledWithMatch('startApp', {
        appId: '20000067',
        param: {
          url: expectedUrl,
        }
      }));
    });

    it("使用 `legend.call('startApp')` 打开其他小程序（特惠充）", () => {
      const expectedUrl = 'https://www.example.com/page=pages/index/index&query=mobile%3D18812345678';

      open('https://www.example.com/page=pages/index/index&query=mobile%3D18812345678');

      assert(legend.call.calledWithMatch('startApp', {
        param: {
          url: expectedUrl,
        }
      }));
    });

    it("使用 `legend.call('startApp')` 打开 https 链接", () => {
      const expectedUrl = 'https://www.example.com?name=legend&mobile=18812345678';

      open(addQuery('https://www.example.com?name=legend', { mobile: '18812345678' }));;

      assert(legend.call.calledWithMatch('startApp', {
        param: {
          url: expectedUrl,
        }
      }));
    });

    it("使用 `legend.navigateTo()` 打开当前小程序内页面并带入参数", () => {
      const expectedUrl = '/pages/index/index?mobile=18812345678';

      open(addQuery('/pages/index/index', { mobile: '18812345678' }));

      assert(legend.navigateTo.calledWithMatch({
        url: expectedUrl,
      }));
    });

  });

  describe('#addQuery()', () => {
    // normal cases
    it('URL 无参数拼接正常', () => {
      const url = 'https://www.example.com';
      const expected = 'https://www.example.com?mobile=18812345678'
      const actual = addQuery(url, { mobile: '18812345678' });;

      assert(actual === expected);
    });

    it('URL 存在参数拼接正常', () => {
      const url = 'https://www.example.com?name=legend';
      const expected = 'https://www.example.com?name=legend&mobile=18812345678'
      const actual = addQuery(url, { mobile: '18812345678' });;

      assert(actual === expected);
    });
  });
});
