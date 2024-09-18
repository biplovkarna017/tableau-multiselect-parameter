"use strict";
!function() {
    let configureJSON = "",
        configArray = [],
        worksheetNames = [],
        cachedParameters = [];

    function configure() {
        tableau.extensions.ui.displayDialogAsync("./Configure.html", "", {
            height: 500,
            width: 1e3
        }).then(() => {
            configArray = JSON.parse(configureJSON = tableau.extensions.settings.get("config"));
            worksheetNames = [...new Set(configArray.map(config => config.sheet))];
            tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(parameters => {
                cachedParameters = parameters;
            }).then(()=>{
                addFilterChangeListeners();
            });
        });
    }

    function addFilterChangeListeners() {
        tableau.extensions.dashboardContent.dashboard.worksheets.forEach(worksheet => {
            if (worksheetNames.includes(worksheet.name)) {
                worksheet.addEventListener(tableau.TableauEventType.FilterChanged, filterEvent => {
                    filterEvent.getFilterAsync().then(triggerFilter => {
                        let filteredConfig = configArray.find(config => config.filter === triggerFilter.fieldName && config.sheet === worksheet.name);
                        if (filteredConfig) {
                            updateFilter(triggerFilter, filteredConfig);
                        }
                    });
                });
            }
        });
    }

    function updateFilter(filter, config) {
        if (filter.isAllSelected) {
            if (config.allValues) {
                filter.getDomainAsync(tableau.FilterDomainType.RELEVANT).then(domain => {
                    let selectedValues = domain.values.map(e => e.value).join("|");
                    updateParameter(config.param, selectedValues);
                });
            } else {
                updateParameter(config.param, ".*");
            }
        } else {
            let selectedValues = filter.appliedValues.length === 0 ? "^$" : filter.appliedValues.map(e => e.value).join("|");
            updateParameter(config.param, selectedValues);
        }
    }

    function updateParameter(paramName, value) {
        if (cachedParameters.length === 0) {
            tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(parameters => {
                cachedParameters = parameters;
                changeParameterValue(paramName, value);
            });
        } else {
            changeParameterValue(paramName, value);
        }
    }

    function changeParameterValue(paramName, value) {
        let parameter = cachedParameters.find(param => param.name === paramName);
        if (parameter && parameter.currentValue.value !== value) {
            parameter.changeValueAsync(value);
        }
    }

    $(document).ready(function() {
        tableau.extensions.initializeAsync({
            configure: configure
        }).then(() => {
            configureJSON = tableau.extensions.settings.get("config");
            if (configureJSON) {
                configArray = JSON.parse(configureJSON);
                worksheetNames = [...new Set(configArray.map(e => e.sheet))];
                tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(parameters => {
                cachedParameters = parameters;
            }).then(()=>{
                addFilterChangeListeners();
            });
            } else {
                configure();
            }
        });
    });
}();
