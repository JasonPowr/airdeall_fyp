export function getStoredAlerts() {
    return sessionStorage.getItem('storedAlerts');
}

export function setAlertsInStorage(alerts) {
    sessionStorage.setItem('storedAlerts', JSON.stringify(alerts));
}

export function addAlertToLocalStorage(alert) {
    const storedAlerts = JSON.parse(getStoredAlerts());
    storedAlerts.push({alert});
    setAlertsInStorage(storedAlerts);
}

export function updateAlertInLocalStorage(id, updatedAlert) {
    const storedAlerts = JSON.parse(getStoredAlerts());
    storedAlerts.map((index) => {
        if (index.alert.id === id) {
            index.alert = updatedAlert;
        }
    });
    setAlertsInStorage(storedAlerts);
}

export function deleteAlertFromLocalStorage(alertId) {
    const storedAlerts = JSON.parse(getStoredAlerts());
    storedAlerts.map((index) => {
        if (index.alert.id === alertId) {
            storedAlerts.splice(storedAlerts.indexOf(index.alert, 1))
        }
    });
    setAlertsInStorage(storedAlerts);
}


//https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
////https://stackoverflow.com/questions/6193574/save-javascript-objects-in-sessionstorage
//https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript