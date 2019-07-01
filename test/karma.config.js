// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const { resolve } = require('path')

module.exports = function (config) {
  config.set({
    autoWatch: false,
    basePath: '',
    browsers: ['ChromeHeadless'],
    colors: true,
    concurrency: Infinity,
    coverageIstanbulReporter: {
      combineBrowserReports: true,
      dir: 'test/coverage/',
      fixWebpackSourcePaths: true,
      reports: ['html', 'lcovonly', 'text-summary'],
      skipFilesWithNoCoverage: false
    },
    files: [
      { included: true, pattern: './elements/index.spec.js', type: 'module' },
    ],
    frameworks: ['chai', 'mocha', 'sinon'],
    logLevel: config.LOG_INFO,
    plugins: [
      require('karma-chai'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-mocha'),
      require('karma-sinon'),
      require('karma-webpack'),
    ],
    port: 9876,
    preprocessors: {
      './elements/index.spec.js': ['webpack'],
    },
    reporters: ['progress', 'coverage-istanbul'],
    singleRun: true,
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            enforce: 'post',
            exclude: /(node_modules|\.spec\.js)$/,
            include: resolve('src/'),
            test: /\.js$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            },
          }
        ]
      },
    },
    webpackMiddleware: {
      noInfo: true
    }
  })
}
