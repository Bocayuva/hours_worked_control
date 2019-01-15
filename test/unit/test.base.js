'use strict';

const { stub, spy } = require('sinon');
const rewire = require('rewire');
const { should, use, expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
use(chaiAsPromised);
should();
class TestBase {
  constructor(path, isModel, newInstance) {
    this.stub = stub;
    this.expect = expect;
    this.initialize();
    this.Promise = require('bluebird');
    this.restoreMethods = [];
    this.Queue = require('../../src/commons/constants/queue');
    this.msgerror = require('../../src/commons/constants/messageerror');
    if (path) {
      if (isModel) {
        this.Model = require(path);
      } else {
        if (newInstance) {
          const Controller = rewire(path);
          this.controller = new Controller();
        } else {
          this.controller = rewire(path);
        }
      }
    }
    this.expectedResponse = {
      message: '',
      data: { _id: 1 }
    };
  }

  initialize() {
    this.status = stub();
    this.json = spy();
    this.next = () => { };
    this.res = {};
    this.res.set = () => { };
    this.res.end = () => { };
    this.res.writeHead = () => { };
    this.res.download = (path, cb) => cb(null);
    this.res.status = this.status;
    this.res.json = this.json;
    this.status.returns(this.res);
    this.methods = {
      select: function () {
        return this;
      },
      lean: function () {
        return this;
      },
      where: function () {
        return this;
      },
      nin: function () {
        return this;
      },
      in: function () {
        return this;
      },
      or: function () {
        return this;
      },
      populate: function () {
        return this;
      },
      distinct: function () {
        return this;
      },
      skip: function () {
        return this;
      },
      limit: function () {
        return this;
      },
      sort: function () {
        return this;
      },
      aggregate: function () {
        return this;
      },
      count: function () {
        return this;
      },
      exec: function () {
        return this.Promise.resolve();
      }
    };
  }

  restore(method) {
    if (method) {
      this.restoreMethods.push(method);
    } else {
      this.restoreMethods.forEach(method => {
        if (method.restore) {
          method.restore();
        }
      });
    }
  }

  test() { }

  run(name) {
    let descName = name;
    if (!name) {
      descName = this.controller ? this.controller.constructor.name : `${this.Model.modelName} ${this.Model.name}`;
    }
    describe(descName, () => {
      if (this.controller) {
        afterEach(() => this.restore());
      }

      this.test();
    });
  }
}

module.exports = TestBase;
