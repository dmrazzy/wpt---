// Test that constructor for the node with name |nodeName| handles the
// various possible values for channelCount, channelCountMode, and
// channelInterpretation.

// The |should| parameter is the test function from new |Audit|.
function testAudioNodeOptions(should, context, nodeName, expectedNodeOptions) {
  if (expectedNodeOptions === undefined)
    expectedNodeOptions = {};
  let node;

  // Test that we can set channelCount and that errors are thrown for
  // invalid values
  let testChannelCount = 17;
  if (expectedNodeOptions.channelCount) {
    testChannelCount = expectedNodeOptions.channelCount.value;
  }
  should(
      () => {
        node = new window[nodeName](
            context, Object.assign({}, expectedNodeOptions.additionalOptions, {
              channelCount: testChannelCount
            }));
      },
      'new ' + nodeName + '(c, {channelCount: ' + testChannelCount + '})')
      .notThrow();
  should(node.channelCount, 'node.channelCount').beEqualTo(testChannelCount);

  if (expectedNodeOptions.channelCount &&
      expectedNodeOptions.channelCount.isFixed) {
    // The channel count is fixed.  Verify that we throw an error if
    // we try to change it. Arbitrarily set the count to be one more
    // than the expected value.
    testChannelCount = expectedNodeOptions.channelCount.value + 1;
    should(
        () => {
          node = new window[nodeName](
              context,
              Object.assign(
                  {}, expectedNodeOptions.additionalOptions,
                  {channelCount: testChannelCount}));
        },
        'new ' + nodeName + '(c, {channelCount: ' + testChannelCount + '})')
        .throw(DOMException,
               expectedNodeOptions.channelCount.exceptionType);
    // And test that setting it to the fixed value does not throw.
    testChannelCount = expectedNodeOptions.channelCount.value;
    should(
        () => {
          node = new window[nodeName](
              context,
              Object.assign(
                  {}, expectedNodeOptions.additionalOptions,
                  {channelCount: testChannelCount}));
          node.channelCount = testChannelCount;
        },
        '(new ' + nodeName + '(c, {channelCount: ' + testChannelCount + '})).channelCount = ' + testChannelCount)
        .notThrow();
  } else {
    // The channel count is not fixed.  Try to set the count to invalid
    // values and make sure an error is thrown.
    [0, 99].forEach(testValue => {
      should(() => {
        node = new window[nodeName](
            context, Object.assign({}, expectedNodeOptions.additionalOptions, {
              channelCount: testValue
            }));
      }, `new ${nodeName}(c, {channelCount: ${testValue}})`)
          .throw(DOMException, 'NotSupportedError');
    });
  }

  // Test channelCountMode
  let testChannelCountMode = 'max';
  if (expectedNodeOptions.channelCountMode) {
    testChannelCountMode = expectedNodeOptions.channelCountMode.value;
  }
  should(
      () => {
        node = new window[nodeName](
            context, Object.assign({}, expectedNodeOptions.additionalOptions, {
              channelCountMode: testChannelCountMode
            }));
      },
      'new ' + nodeName + '(c, {channelCountMode: "' + testChannelCountMode +
          '"}')
      .notThrow();
  should(node.channelCountMode, 'node.channelCountMode')
      .beEqualTo(testChannelCountMode);

  if (expectedNodeOptions.channelCountMode &&
      expectedNodeOptions.channelCountMode.isFixed) {
    // Channel count mode is fixed.  Test setting to something else throws.
    ['max', 'clamped-max', 'explicit'].forEach(testValue => {
      if (testValue !== expectedNodeOptions.channelCountMode.value) {
        should(
            () => {
              node = new window[nodeName](
                  context,
                  Object.assign(
                      {}, expectedNodeOptions.additionalOptions,
                      {channelCountMode: testValue}));
            },
            `new ${nodeName}(c, {channelCountMode: "${testValue}"})`)
            .throw(DOMException,
                   expectedNodeOptions.channelCountMode.exceptionType);
      } else {
        // Test that explicitly setting the fixed value is allowed.
        should(
            () => {
              node = new window[nodeName](
                  context,
                  Object.assign(
                      {}, expectedNodeOptions.additionalOptions,
                      {channelCountMode: testValue}));
              node.channelCountMode = testValue;
            },
            `(new ${nodeName}(c, {channelCountMode: "${testValue}"})).channelCountMode = "${testValue}"`)
            .notThrow();
      }
    });
  } else {
    // Mode is not fixed. Verify that we can set the mode to all valid
    // values, and that we throw for invalid values.

    let testValues = ['max', 'clamped-max', 'explicit'];

    testValues.forEach(testValue => {
      should(() => {
        node = new window[nodeName](
            context, Object.assign({}, expectedNodeOptions.additionalOptions, {
              channelCountMode: testValue
            }));
      }, `new ${nodeName}(c, {channelCountMode: "${testValue}"})`).notThrow();
      should(
          node.channelCountMode, 'node.channelCountMode after valid setter')
          .beEqualTo(testValue);

    });

    should(
        () => {
          node = new window[nodeName](
              context,
              Object.assign(
                  {}, expectedNodeOptions.additionalOptions,
                  {channelCountMode: 'foobar'}));
        },
        'new ' + nodeName + '(c, {channelCountMode: "foobar"}')
        .throw(TypeError);
    should(node.channelCountMode, 'node.channelCountMode after invalid setter')
        .beEqualTo(testValues[testValues.length - 1]);
  }

  // Test channelInterpretation
  if (expectedNodeOptions.channelInterpretation &&
      expectedNodeOptions.channelInterpretation.isFixed) {
    // The channel interpretation is fixed.  Verify that we throw an
    // error if we try to change it.
    ['speakers', 'discrete'].forEach(testValue => {
      if (testValue !== expectedNodeOptions.channelInterpretation.value) {
        should(
            () => {
              node = new window[nodeName](
                  context,
                  Object.assign(
                      {}, expectedNodeOptions.additionOptions,
                      {channelInterpretation: testValue}));
            },
            `new ${nodeName}(c, {channelInterpretation: "${testValue}"})`)
            .throw(DOMException,
                   expectedNodeOptions.channelCountMode.exceptionType);
      } else {
        // Check that assigning the fixed value is OK.
        should(
            () => {
              node = new window[nodeName](
                  context,
                  Object.assign(
                      {}, expectedNodeOptions.additionOptions,
                      {channelInterpretation: testValue}));
              node.channelInterpretation = testValue;
            },
            `(new ${nodeName}(c, {channelInterpretation: "${testValue}"})).channelInterpretation = "${testValue}"`)
            .notThrow();
      }
    });
  } else {
    // Channel interpretation is not fixed. Verify that we can set it
    // to all possible values.
    should(
        () => {
          node = new window[nodeName](
              context,
              Object.assign(
                  {}, expectedNodeOptions.additionalOptions,
                  {channelInterpretation: 'speakers'}));
        },
        'new ' + nodeName + '(c, {channelInterpretation: "speakers"})')
        .notThrow();
    should(node.channelInterpretation, 'node.channelInterpretation')
        .beEqualTo('speakers');

    should(
        () => {
          node = new window[nodeName](
              context,
              Object.assign(
                  {}, expectedNodeOptions.additionalOptions,
                  {channelInterpretation: 'discrete'}));
        },
        'new ' + nodeName + '(c, {channelInterpretation: "discrete"})')
        .notThrow();
    should(node.channelInterpretation, 'node.channelInterpretation')
        .beEqualTo('discrete');

    should(
        () => {
          node = new window[nodeName](
              context,
              Object.assign(
                  {}, expectedNodeOptions.additionalOptions,
                  {channelInterpretation: 'foobar'}));
        },
        'new ' + nodeName + '(c, {channelInterpretation: "foobar"})')
        .throw(TypeError);
    should(
        node.channelInterpretation,
        'node.channelInterpretation after invalid setter')
        .beEqualTo('discrete');
  }
}

function initializeContext(should) {
  let c;
  should(() => {
    c = new OfflineAudioContext(1, 1, 48000);
  }, 'context = new OfflineAudioContext(...)').notThrow();

  return c;
}

function testInvalidConstructor(should, name, context) {
  should(() => {
    new window[name]();
  }, 'new ' + name + '()').throw(TypeError);
  should(() => {
    new window[name](1);
  }, 'new ' + name + '(1)').throw(TypeError);
  should(() => {
    new window[name](context, 42);
  }, 'new ' + name + '(context, 42)').throw(TypeError);
}

function testDefaultConstructor(should, name, context, options) {
  let node;

  let message = options.prefix + ' = new ' + name + '(context';
  if (options.constructorOptions)
    message += ', ' + JSON.stringify(options.constructorOptions);
  message += ')'

  should(() => {
    node = new window[name](context, options.constructorOptions);
  }, message).notThrow();

  should(node instanceof window[name], options.prefix + ' instanceof ' + name)
      .beEqualTo(true);
  should(node.numberOfInputs, options.prefix + '.numberOfInputs')
      .beEqualTo(options.numberOfInputs);
  should(node.numberOfOutputs, options.prefix + '.numberOfOutputs')
      .beEqualTo(options.numberOfOutputs);
  should(node.channelCount, options.prefix + '.channelCount')
      .beEqualTo(options.channelCount);
  should(node.channelCountMode, options.prefix + '.channelCountMode')
      .beEqualTo(options.channelCountMode);
  should(node.channelInterpretation, options.prefix + '.channelInterpretation')
      .beEqualTo(options.channelInterpretation);

  return node;
}

function testDefaultAttributes(should, node, prefix, items) {
  items.forEach((item) => {
    let attr = node[item.name];
    if (attr instanceof AudioParam) {
      should(attr.value, prefix + '.' + item.name + '.value')
          .beEqualTo(item.value);
    } else {
      should(attr, prefix + '.' + item.name).beEqualTo(item.value);
    }
  });
}

// Test that constructor for the node with name |nodeName| handles the
// various possible values for channelCount, channelCountMode, and
// channelInterpretation.

// (Todo: Punith, Saqlain) Will be replaced with original function names
// after we are done with converting all the tests that require these functions
// from audit.js to testharness.js

function testAudioNodeOptions_W3CTH(context, nodeName, expectedNodeOptions) {
  if (expectedNodeOptions === undefined)
    expectedNodeOptions = {};
  let node;

  // Test that we can set channelCount and that errors are thrown for
  // invalid values
  let testChannelCount = 17;
  if (expectedNodeOptions.channelCount) {
    testChannelCount = expectedNodeOptions.channelCount.value;
  }

  node = new window[nodeName](
      context,
      Object.assign({}, expectedNodeOptions.additionalOptions, {
        channelCount: testChannelCount
      }));
  assert_equals(node.channelCount, testChannelCount, 'node.channelCount');

  if (expectedNodeOptions.channelCount &&
      expectedNodeOptions.channelCount.isFixed) {
    // The channel count is fixed.  Verify that we throw an error if
    // we try to change it. Arbitrarily set the count to be one more
    // than the expected value.
    const invalidCount = expectedNodeOptions.channelCount.value + 1;
    assert_throws_dom(
        expectedNodeOptions.channelCount.exceptionType,
        () => new window[nodeName](
            context,
            Object.assign({}, expectedNodeOptions.additionalOptions, {
              channelCount: invalidCount
            })),
        `new ${nodeName}(context, {channelCount: ${invalidCount}})`);

    // And test that setting it to the fixed value does not throw.
    testChannelCount = expectedNodeOptions.channelCount.value;
    node = new window[nodeName](
        context,
        Object.assign({}, expectedNodeOptions.additionalOptions, {
          channelCount: testChannelCount
        }));
    node.channelCount = testChannelCount;
  } else {
    // The channel count is not fixed.  Try to set the count to invalid
    // values and make sure an error is thrown.
    [0, 99].forEach(testValue => {
      assert_throws_dom(
          'NotSupportedError',
          () => new window[nodeName](
              context,
              Object.assign({}, expectedNodeOptions.additionalOptions, {
                channelCount: testValue
              })),
          `new ${nodeName}(context, {channelCount: ${testValue}})`);
    });
  }

  // Test channelCountMode
  let testChannelCountMode = 'max';
  if (expectedNodeOptions.channelCountMode) {
    testChannelCountMode = expectedNodeOptions.channelCountMode.value;
  }

  node = new window[nodeName](
      context,
      Object.assign({}, expectedNodeOptions.additionalOptions, {
        channelCountMode: testChannelCountMode
      }));
  assert_equals(
      node.channelCountMode,
      testChannelCountMode,
      'node.channelCountMode');

  if (expectedNodeOptions.channelCountMode &&
      expectedNodeOptions.channelCountMode.isFixed) {
    ['max', 'clamped-max', 'explicit'].forEach(testValue => {
      if (testValue !== expectedNodeOptions.channelCountMode.value) {
        assert_throws_dom(
            expectedNodeOptions.channelCountMode.exceptionType,
            () => new window[nodeName](
                context,
                Object.assign({}, expectedNodeOptions.additionalOptions, {
                  channelCountMode: testValue
                })),
            `new ${nodeName}(context, {channelCountMode: "${testValue}"})`);
      } else {
        node = new window[nodeName](
            context,
            Object.assign({}, expectedNodeOptions.additionalOptions, {
              channelCountMode: testValue
            }));
        node.channelCountMode = testValue;
      }
    });
  } else {
    ['max', 'clamped-max', 'explicit'].forEach(testValue => {
      node = new window[nodeName](
          context,
          Object.assign({}, expectedNodeOptions.additionalOptions, {
            channelCountMode: testValue
          }));
      assert_equals(
          node.channelCountMode,
          testValue,
          `node.channelCountMode after setting to ${testValue}`);
    });

    assert_throws_js(
        TypeError,
        () => new window[nodeName](
            context,
            Object.assign({}, expectedNodeOptions.additionalOptions, {
              channelCountMode: 'foobar'
            })),
        'Invalid channelCountMode should throw');
  }

  // Test channelInterpretation
  if (expectedNodeOptions.channelInterpretation &&
      expectedNodeOptions.channelInterpretation.isFixed) {
    ['speakers', 'discrete'].forEach(testValue => {
      if (testValue !== expectedNodeOptions.channelInterpretation.value) {
        assert_throws_dom(
            expectedNodeOptions.channelCountMode.exceptionType,
            () => new window[nodeName](
                context,
                Object.assign({}, expectedNodeOptions.additionalOptions, {
                  channelInterpretation: testValue
                })),
            `new ${nodeName}(context, {channelInterpretation: "${testValue}"})`);
      } else {
        node = new window[nodeName](
            context,
            Object.assign({}, expectedNodeOptions.additionalOptions, {
              channelInterpretation: testValue
            }));
        node.channelInterpretation = testValue;
      }
    });
  } else {
    node = new window[nodeName](
        context,
        Object.assign({}, expectedNodeOptions.additionalOptions, {
          channelInterpretation: 'speakers'
        }));
    assert_equals(node.channelInterpretation, 'speakers');

    node = new window[nodeName](
        context,
        Object.assign({}, expectedNodeOptions.additionalOptions, {
          channelInterpretation: 'discrete'
        }));
    assert_equals(node.channelInterpretation, 'discrete');

    assert_throws_js(
        TypeError,
        () => new window[nodeName](
            context,
            Object.assign({}, expectedNodeOptions.additionalOptions, {
              channelInterpretation: 'foobar'
            })),
        'Invalid channelInterpretation should throw');
  }
}

function testInvalidConstructor_W3CTH(name, context) {
  assert_throws_js(TypeError, () => new window[name](), 'new ' + name + '()');
  assert_throws_js(TypeError, () => new window , 'new ' + name + '(1)');
  assert_throws_js(
      TypeError,
      () => new window[name](context, 42), 'new ' + name + '(context, 42)');
}

function testDefaultConstructor_W3CTH(name, context, options) {
  let node;

  node = new window[name](context, options.constructorOptions);

  assert_true(
      node instanceof window[name],
      `${options.prefix} instanceof ${name}`);
  assert_equals(
      node.numberOfInputs, options.numberOfInputs,
      `${options.prefix}.numberOfInputs`);
  assert_equals(
      node.numberOfOutputs, options.numberOfOutputs,
      `${options.prefix}.numberOfOutputs`);
  assert_equals(
      node.channelCount, options.channelCount,
      `${options.prefix}.channelCount`);
  assert_equals(
      node.channelCountMode, options.channelCountMode,
      `${options.prefix}.channelCountMode`);
  assert_equals(
      node.channelInterpretation, options.channelInterpretation,
      `${options.prefix}.channelInterpretation`);

  return node;
}

function testDefaultAttributes_W3CTH(node, prefix, items) {
  items.forEach((item) => {
    const attr = node[item.name];
    if (attr instanceof AudioParam) {
      assert_equals(attr.value, item.value, `${prefix}.${item.name}.value`);
    } else {
      assert_equals(attr, item.value, `${prefix}.${item.name}`);
    }
  });
}
