declare module 'url-opener' {
  /**
   *
   * @param url
   * @param startupParams 启动参数
   *
   * @example
   *
   * // 打开 https 链接，并带入参数
   * open('https://www.example.com', { name: 'alice', mobile: '18812345678' });
   * // 将拼接链接并打开 https://www.example.com?name=alice&mobile=18812345678
   */
  function open(url: string, startupParams?: Omit<IStartupParams, 'url'>): void;


  /**
   * startApp 启动参数。更多参数或详情请参考：http://www.example.com/docs
   */
  interface IStartupParams {
    url: string;
    startMultApp?: 'YES' | 'NO';
    transparentTitle?: 'always' | 'auto' | 'none';
  }
}
