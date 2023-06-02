import { ResultsAssertions } from './ResultAssertions';

class TestBook {
  constructor(testBookData, executionDelay = 5000, containerId = 'testBook') {
    this.markupItems = [];
    this.container = document.getElementById(containerId);
    this.executionDelay = executionDelay;
    this.createTestBook(testBookData);
  }

  generateSuiteMarkup(suiteGroupData, groupIndex) {
    let markupString = `
            <div class="row">
                <div class="col mt-4 pt-2 pb-2">
                    <h2>${suiteGroupData.groupName}</h2>
                </div>
            </div>
        `;

    const totalSuites = suiteGroupData.suites.length;

    for (let i = 0; i < totalSuites; i++) {
      const suite = suiteGroupData.suites[i];

      markupString += `
                <div class="row">
                    <div class="col" id="${suite.id}">
                        <div class="row">
                            <div class="col">
                                <h3>${suite.name}</h3>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <table class="table table-striped table-hover table-bordered" style="table-layout: fixed; width: 100%">
                                    <caption>${suite.description}</caption>
                                    <colgroup>
                                      <col style="width: 5%;" />
                                      <col style="width: 25%;" />
                                      <col style="width: 10%;" />
                                      <col style="width: 30%;" />
                                      <col style="width: 30%;" />
                                    </colgroup>
                                    <thead class="table-dark">
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Test Case</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Generated Payload</th>
                                        <th scope="col">Expected Payload</th>
                                    </tr>
                                    </thead>
                                    <tbody class="table-group-divider">
            `;

      const testsCases = suite.testCases;
      const totalTestCases = testsCases.length;

      for (let j = 0; j < totalTestCases; j++) {
        const testCase = testsCases[j];

        markupString += `
                    <tr class="collapsed-row" data-testid="test-case-${testCase.id}">
                        <td style="word-wrap: break-word; position: relative;">${j + 1}</td>
                        <th scope="row" class="table-heading" style="word-wrap: break-word; font-weight: normal">
                            <button
                              type="button"
                              class="btn btn-dark btn-sm testCaseTrigger"
                              id="test-case-trigger-${testCase.id}"
                               data-suite-group-index="${groupIndex}"
                               data-suite-index="${i}"
                               data-test-case-index="${j}"
                               style="text-align: left;">
                                <span class="text-start">
                                    ${testCase.description}
                                </span>
                            </button>
                            <hr>
                            <button type="button" class="btn btn-secondary btn-sm testCaseToggle">
                                <i class="bi bi-arrows-expand"></i> Expand/Collapse
                            </button>
                            <hr>
                            <p><strong>Arguments Array</strong></p>
                            <p>${testCase.triggerHandler}</p>
                            <div style="word-wrap: break-word; position: relative;">
                              <pre>${JSON.stringify(testCase.inputData, undefined, 2)}</pre>
                            </div>
                        </th>
                        <td style="word-wrap: break-word;"><span class="badge badge-warning" id="test-case-status-${
                          testCase.id
                        }">pending</span></td>
                        <td style="word-wrap: break-word; position: relative;">
                          <pre class="testCaseResult" id="test-case-result-${
                            testCase.id
                          }" data-test-case-id="${testCase.id}"></pre>
                          <button type="button" class="btn btn-secondary" style="position: absolute; top:10px; right:10px;">
                            <i class="bi bi-clipboard" data-clipboard-target="#test-case-result-${
                              testCase.id
                            }"></i>
                          </button>
                        </td>
                        <td style="word-wrap: break-word; position: relative;">
                          <pre data-testid="test-case-expected-${testCase.id}" id="expected-data-${
          testCase.id
        }">
                            ${JSON.stringify(testCase.expectedResult, undefined, 2)}
                          </pre>
                          <button type="button" class="btn btn-secondary" style="position: absolute; top:10px; right:10px;">
                            <i class="bi bi-clipboard" data-clipboard-target="#expected-data-${
                              testCase.id
                            }"></i>
                          </button>
                        </td>
                    </tr>
                `;
      }

      markupString += `
                                </tbody>
                                </table>
                                <hr>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    }

    return markupString;
  }

  joinHtml(items) {
    let joinedHtml = '';

    Object.keys(items).forEach(key => {
      joinedHtml += items[key];
    });

    return joinedHtml;
  }

  attachHtml(suiteGroupsData) {
    const totalSuiteGroups = suiteGroupsData.length;
    // TODO: make it sticky header
    const headerMarkup = `
            <div class="sticky-top">
                <div class="row g-0 pt-4 pb-2 mb-2 border-bottom" style="background: #FFFFFF;">
                    <div class="col">
                        <h1>RudderStack JS SDK Sanity Suite</h1>
                        <p>
                            <button type="button" class="btn btn-dark" id="execute-all-trigger">
                                Execute All
                            </button>
                            <a href="https://jsondiff.com" target="_blank" class="btn btn-secondary">See payloads diff</a>
                            <button type="button" class="btn btn-secondary" onClick="window.location.reload()">
                                Reset/Reload
                            </button>
                            <button type="button" class="btn btn-outline-dark">
                              Tests Case pass/total: <span class="badge" id="resultSummary">-</span>
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        `;

    this.markupItems.push(headerMarkup);

    for (let i = 0; i < totalSuiteGroups; i++) {
      this.markupItems.push(this.generateSuiteMarkup(suiteGroupsData[i], i));
    }

    this.container.innerHTML = this.joinHtml(this.markupItems);
  }

  // Invoke the trigger handlers passing as arguments the input data array items
  invokeTriggerHandlers(clickHandler, inputData, resultCallback) {
    // Always add callback methods in order to retrieve the generated message object
    const inputs = [...inputData];
    inputs.push(resultCallback);

    if (typeof clickHandler === 'function') {
      clickHandler.apply(null, inputs);
    } else if (typeof clickHandler === 'string') {
      window.rudderanalytics[clickHandler].apply(null, inputs);
    }
  }

  attachClickHandlers(suiteData) {
    const triggerElements = document.getElementsByClassName('testCaseTrigger');
    const totalTriggerElements = triggerElements.length;

    for (let i = 0; i < totalTriggerElements; i++) {
      const triggerElement = triggerElements[i];
      const suiteGroupIndex = triggerElement.dataset.suiteGroupIndex;
      const suiteIndex = triggerElement.dataset.suiteIndex;
      const testCaseIndex = triggerElement.dataset.testCaseIndex;
      const testCaseData = suiteData[suiteGroupIndex].suites[suiteIndex].testCases[testCaseIndex];
      const resultCallback = function (generatedPayload) {
        const resultContainer = document.getElementById(`test-case-result-${testCaseData.id}`);
        // To cater for both v1.1 and v3 internal data structure
        let normalisedResultData = generatedPayload;
        if (!normalisedResultData.message) {
          normalisedResultData = {
            message: generatedPayload,
          };
        }
        resultContainer.innerHTML = JSON.stringify(normalisedResultData, undefined, 2);
      };

      triggerElement.addEventListener('click', () => {
        const clickHandlerData = testCaseData.triggerHandler;

        // Allow single or sequential calls with defined sequential payloads
        if (Array.isArray(clickHandlerData)) {
          const totalClickHandlers = clickHandlerData.length;

          clickHandlerData.forEach((clickHandler, index) => {
            if (index === totalClickHandlers - 1) {
              // Only pass callback on last item of the sequence
              this.invokeTriggerHandlers(
                clickHandler,
                testCaseData.inputData[index],
                resultCallback,
              );
            } else {
              this.invokeTriggerHandlers(clickHandler, testCaseData.inputData[index]);
            }
          });
        } else {
          this.invokeTriggerHandlers(
            testCaseData.triggerHandler,
            testCaseData.inputData,
            resultCallback,
          );
        }
        if (typeof testCaseData.resetWindow === 'function') {
          setTimeout(() => {
            testCaseData.resetWindow();
          }, 1);
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const clip = new window.ClipboardJS('.bi-clipboard');
    }

    const executeAllElement = document.getElementById('execute-all-trigger');
    executeAllElement.addEventListener('click', () => {
      this.executeSuites();
    });

    const expandToggleElements = document.getElementsByClassName('testCaseToggle');
    Array.from(expandToggleElements).forEach(function (element) {
      element.addEventListener('click', event => {
        if (event.target.parentNode.parentNode.className) {
          event.target.parentNode.parentNode.className = '';
        } else {
          event.target.parentNode.parentNode.className = 'collapsed-row';
        }
      });
    });
  }

  attachResultsObserver() {
    const resultContainerElements = document.getElementsByClassName('testCaseResult');
    const totalResultContainerElements = resultContainerElements.length;

    for (let i = 0; i < totalResultContainerElements; i++) {
      const resultContainerElement = resultContainerElements[i];
      const resultRowElement = resultContainerElement.parentNode.parentNode;
      const testCaseId = resultContainerElement.dataset.testCaseId;

      const observer = new MutationObserver((mutationList, observer) => {
        const resultData = mutationList[0].addedNodes[0].nodeValue.trim();
        const expectedResult = resultRowElement.lastElementChild.childNodes[1].textContent.trim();
        const sanitizedResultData = ResultsAssertions.sanitizeResultData(
          resultData,
          expectedResult,
        );
        const assertionResult = ResultsAssertions.assertDeepObjectDiffResult(
          sanitizedResultData,
          expectedResult,
        );

        const statusElement = document.getElementById(`test-case-status-${testCaseId}`);
        statusElement.textContent = assertionResult;
        statusElement.className = `badge badge-${assertionResult}`;
        statusElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });

      observer.observe(resultContainerElement, {
        childList: true,
      });
    }
  }

  resultStatusSummary() {
    const resultSummaryElement = document.getElementById('resultSummary');
    const totalTestCases = document.getElementsByClassName('testCaseResult').length;
    const totalPassedTestCases = document.getElementsByClassName('badge-success').length;

    resultSummaryElement.innerHTML = `${totalTestCases}/${totalPassedTestCases}`;
    resultSummaryElement.classList.add('bg-warning', 'summary-complete');
  }

  executeSuites() {
    const testCaseTriggers = document.getElementsByClassName('testCaseTrigger');
    const testCaseTriggersCount = testCaseTriggers.length;
    let currentExecutionIndex = 0;
    const delay = this.executionDelay;

    const executeTestCase = () => {
      setTimeout(() => {
        if (currentExecutionIndex < testCaseTriggersCount) {
          testCaseTriggers[currentExecutionIndex].click();
          currentExecutionIndex++;
          executeTestCase();
        } else {
          this.resultStatusSummary();
        }
      }, delay);
    };

    executeTestCase();
  }

  createTestBook(testSuitesData) {
    this.attachHtml(testSuitesData);
    this.attachClickHandlers(testSuitesData, 'testCaseTrigger');
    this.attachResultsObserver();
  }
}

export { TestBook };
