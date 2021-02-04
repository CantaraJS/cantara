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
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      console: require.resolve('console-browserify/'),
      constants: require.resolve('constants-browserify/'),
      crypto: require.resolve('crypto-browserify/'),
      domain: require.resolve('domain-browser/'),
      events: require.resolve('events/'),
      http: require.resolve('stream-http/'),
      https: require.resolve('https-browserify/'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify/'),
      punycode: require.resolve('punycode/'),
      process: require.resolve('process/browser'),
      querystring: require.resolve('querystring-es3/'),
      stream: require.resolve('stream-browserify/'),
      _stream_duplex: require.resolve('readable-stream/lib/_stream_duplex.js'),
      _stream_passthrough: require.resolve(
        'readable-stream/lib/_stream_passthrough.js',
      ),
      _stream_readable: require.resolve(
        'readable-stream/lib/_stream_readable.js',
      ),
      _stream_transform: require.resolve(
        'readable-stream/lib/_stream_transform.js',
      ),
      _stream_writable: require.resolve(
        'readable-stream/lib/_stream_writable.js',
      ),
      string_decoder: require.resolve('string_decoder/'),
      sys: require.resolve('util/'),
      timers: require.resolve('timers-browserify/'),
      tty: require.resolve('tty-browserify/'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
      vm: require.resolve('vm-browserify/'),
      zlib: require.resolve('browserify-zlib/'),
      ...compiler.options.resolve.fallback,
    };
  }
}
