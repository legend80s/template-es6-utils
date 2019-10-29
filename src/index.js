/**
 * 打开链接
 * @param {string} url 跳转地址
 * @param {Omit<IStartupParams, 'url'>} startupParams 启动参数
 * @returns {void}
 *
 * @example
 *
 * // 打开 https 链接，并带入参数
 * open('https://www.example.com', { name: 'alice', mobile: '18812345678' });
 * // 将拼接链接并打开 https://www.example.com?name=alice&mobile=18812345678
 */
export function open(url, startupParams = {}) {
  // console.info('[open]', { url, startupParams });

  if (!url) { return console.error(new TypeError('[open] url required')); }

  if (/^(http|https):\/\//.test(url)) {
    return legend.call('startApp', {
      appId: '20000067',
      param: {
        url,

        ...startupParams,
      },
    }, function fail(error) {
      console.error('[open]', { url, startupParams }, 'failed:', error);
    });
  }

  if (!isObjectEmpty(startupParams)) {
    console.warn('[open] The startupParams (', startupParams , ') will be ignored by `legend.navigateTo`');
  }

  return legend.navigateTo({
    url,

    fail(error) {
      console.error('[open] `legend.navigateTo`', url, 'failed:', error);
    },
  });
}

/**
 * 判断对象是否为空
 * @param {Record<string, any>} obj
 * @returns {boolean}
 *
 * @example
 * isObjectEmpty({})
 * // => true
 *
 * isObjectEmpty({ hello: 'world' })
 * // => false
 */
function isObjectEmpty(obj = {}) {
  return Object.keys(obj).length === 0;
}

/**
 * URL 拼接参数
 * @param {string} url 待拼接的 URL
 * @param {IQuery} query 待拼接的参数
 * @returns {string} empty string when no `url` passed
 *
 * @example
 * addQuery('https://www.example.com?name=legend', { mobile: '18812345678' });
 * // => "https://www.example.com?name=legend&mobile=18812345678"
 */
export function addQuery(url, query = {}) {
  if (!url) {
    console.warn('[addQuery] `url` required')

    return '';
  }

  const querystring = querystringify(query);

  if (!querystring) { return url; }

  return url.includes('?') ? `${url}&${querystring}` : `${url}?${querystring}`;
}

/**
 * 将对象字面量转为 query string。
 *
 * *注意不支持嵌套对象*
 *
 * @param {IQuery} query 待转换的字面量对象
 * @param {(value: any, key: string) => boolean} filter 过滤函数。可选，默认过滤掉值为 `undefined` 的
 * @returns {string}
 *
 * @example
 * querystringify({ a: 'hello', b: 'world' });
 * // => a=hello&b=world
 *
 * querystringify({ a: 'hello', b: null, c: '' }, Boolean);
 * // => a=hello
 */
function querystringify(query, filter = (value) => !isUndefined(value)) {
  return Object.keys(query || {})
    .filter(key => filter(query[key], key))
    .map(key => `${key}=${query[key]}`).join('&');
}

/**
 * 判断变量是否 undefined
 * @param {any} val 待检测的变量
 * @returns {boolean}
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}
