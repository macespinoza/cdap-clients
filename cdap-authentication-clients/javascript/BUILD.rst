===============
Build Procedure
===============

Build process is implemented with `Grunt <http://gruntjs.com/>`__.

To set up all dependencies, use these shell commands::

  # npm install -g grunt-cli
  # npm install -g bower
  $ npm install
  $ bower install


Tests
=====

``$ grunt test``

*Note:* Currently, there is a problem running browser tests with Grunt. To run the browser
test, please open ``test/client.html`` in your favourite browser.


Build
=====

``$ grunt build``


Default behaviour
=================

``$ grunt``

is equivalent to:

``$ grunt test && grunt build``


Build artifacts location
========================

Browser version
---------------

``<project_dir>/dist/browser``

NodeJS version
--------------

``<project_dir>/dist/nodejs``
