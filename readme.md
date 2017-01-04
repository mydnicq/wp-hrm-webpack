#Developing Wordpress theme with Webpack, HMR and Browsersync

The aim of this example is to present a simple workflow of a Wordpress theme development which leverages all goodness of a [Webpack](https://webpack.github.io/) module bundler including with a hot module replacement (HMR) which in combination with [Browsersync](https://www.browsersync.io/) provides a very fast developing experience.

##Installation
Create a folder for your new theme in your local Wordpress 'themes' directory. Then clone this repository into it. When done, install all required packages:
```
$ npm install

or even faster way with yarn

$ yarn
```

##How to use it?
The development process of a new WP theme is divided into a two phases: the development and the final build.

To start the development phase, you should have installed a local Wordpress site. Then run the Webpack development middleware and HMR via Browsersync with:
```
$ npm start
```
This will proxy your local Wordpress site through Browsersync development server, which means that you can see your new theme (if it's been already activated in WP settings) under http://localhost:3000

###JS files
All Javascript files should be stored in 'src/js' folder. You can use ES6, because all code is automatically transpiled to ES5 through [Babel](https://babeljs.io/).

Every time your javascript code is modified, the changes are immediately sent to the browser via HMR. No page refresh is needed.

###CSS files
CSS files should be stored in 'src/css' folder. The example doesn't use any css preprocessors like SASS or LESS but instead it 'post process' all css files with [postCSS](http://postcss.org/). We think this is a better option for handling CSS syntax, because it's faster than any CSS preprocessor and it's more modular which means that you have all freedom to include only those plugins which are needed by your project. Please see the 'postcss.config.js' file to see which postCSS plugins are already included.

The same as we told for Javascript files is also valid for CSS files. Each change in CSS is immediately visible in the browser without any page refresh.

###PHP files
This example provides only a few Wordpress template files just to show a typical file and folder structure of a simple WP theme. You are free to extend your theme with new template files according to your needs.

With Browsersync support we're able to see every single change in WP template file in the browser right after the file is saved without page refresh.

###The final step
When your theme is ready to be published, you are entering the build phase. This step actually extracts all required theme files and copy them into the 'build' directory, which is then ready to become an 'official' WP theme package. You can move it into your local Wordpress 'themes' directory, rename it to whatever you want, modify theme description data in 'style.css' and finally activate the new theme. 

##Credits
This example is heavily inspired by this [repo](https://github.com/bionikspoon/webpack-hmr-wordpress)
Thank you @ThinkCERCA
