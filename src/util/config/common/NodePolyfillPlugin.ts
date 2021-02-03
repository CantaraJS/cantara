import { Compiler, ProvidePlugin } from 'webpack';

/**
 * Webpack 5 removed default support for
 * polyfilled NodeJS core modules.
 * for backward compat, we include them
 * here by default.
 */
export default class NodePolyfillPlugin {
  public apply(compiler: InstanceType<typeof Compiler>) {
    compiler.options.plugins.push(
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        // console: require('console-browserify'),
        process: 'process/browser',
      }),
    );

    compiler.options.resolve.fallback = {
      assert: 'assert',
      buffer: 'buffer',
      console: 'console-browserify',
      constants: 'constants-browserify',
      crypto: 'crypto-browserify',
      domain: 'domain-browser',
      events: 'events',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      path: 'path-browserify',
      punycode: 'punycode',
      process: 'process/browser',
      querystring: 'querystring-es3',
      stream: 'stream-browserify',
      /* eslint-disable camelcase */
      _stream_duplex: 'readable-stream/duplex',
      _stream_passthrough: 'readable-stream/passthrough',
      _stream_readable: 'readable-stream/readable',
      _stream_transform: 'readable-stream/transform',
      _stream_writable: 'readable-stream/writable',
      string_decoder: 'string_decoder',
      /* eslint-enable camelcase */
      sys: 'util',
      timers: 'timers-browserify',
      tty: 'tty-browserify',
      url: 'url',
      util: 'util',
      vm: 'vm-browserify',
      zlib: 'browserify-zlib',
      ...compiler.options.resolve.fallback,
    };
  }
}
