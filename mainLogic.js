'use strict';

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
  let worksheetName = '';
  let filterName = '';
  let parameterName = '';
  $(document).ready(function () {
    tableau.extensions.initializeAsync({ configure: configure }).then(() => {
        if (tableau.extensions.settings.get('worksheetName')) {
            logDebug("Hello"+filterName);
            worksheetName = tableau.extensions.settings.get('worksheetName');
            filterName = tableau.extensions.settings.get('filterName');
            parameterName = tableau.extensions.settings.get('parameterName');
            initializeExtension();
        } else {
            configure();
        }
    });
  });

  function configure() {
    tableau.extensions.ui.displayDialogAsync('dialog.html', '', { height: 510, width: 400 }).then((output) => {
        worksheetName = tableau.extensions.settings.get('worksheetName');
        filterName = tableau.extensions.settings.get('filterName');
        parameterName = tableau.extensions.settings.get('parameterName');
        initializeExtension();
    });
}

function initializeExtension() {
    const worksheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === worksheetName);

    worksheet.addEventListener(tableau.TableauEventType.FilterChanged, (filterEvent) => {
        worksheet.getFiltersAsync().then((filters) => {
            const filter = filters.find(f => f.fieldName === filterName);
    
            if (filter.isAllSelected) {
                // Fetch all values from the filter's domain
                filter.getDomainAsync(tableau.FilterDomainType.RELEVANT).then((domain) => {
                        const allValues = domain.values.map(value => value.value).join('|');
                        updateParameter(parameterName, allValues);
                });
            } else {
                const selectedValues = filter.appliedValues.length === 0 ? '^$' : filter.appliedValues.map(value => value.value).join('|');
                updateParameter(parameterName, selectedValues);
            }
        });
    });

    worksheet.getFiltersAsync().then((filters) => {
        const filter = filters.find(f => f.fieldName === filterName);
        if (filter.isAllSelected) {
            // Fetch all values from the filter's domain
            filter.getDomainAsync(tableau.FilterDomainType.RELEVANT).then((domain) => {
                    const allValues = domain.values.map(value => value.value).join('|');
                    updateParameter(parameterName, allValues);
            });
        } else {
            const selectedValues = filter.appliedValues.length === 0 ? '^$' : filter.appliedValues.map(value => value.value).join('|');
            updateParameter(parameterName, selectedValues);
        }
    });
}

function updateParameter(paramName, value) {
    tableau.extensions.dashboardContent.dashboard.getParametersAsync().then((parameters) => {
        const parameter = parameters.find(param => param.name === paramName);
        if (parameter) {
            parameter.changeValueAsync(value);
        }
    });
}
}

)();
