// ----------------------------------- VARS  ----------------------------------- //
let domSelect, domPercentage, domVolume, domUpdated, domLow, domHigh, domButtons, domLogo = "";

let selectedValue = "BTC";

let dayscount = 7;

let token = "";

let valueYesterday, valueNow, percentage, volume = 0;

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const head = {
    "authorization": "Your API Key"
}





// ----------------------------------- FUNDAMENTALS  ----------------------------------- //

const getDOM = function () {
    domSelect = document.querySelector('.js-select');
    domPercentage = document.querySelector('.js-percentage');
    domVolume = document.querySelector('.js-volume');
    domUpdated = document.querySelector('.js-updated');
    domLow = document.querySelector('.js-low');
    domHigh = document.querySelector('.js-high');
    domButtons = document.querySelectorAll(".js-button");
    domLogo = document.querySelector('.js-logo');
}

const enableListeners = function () {
    domSelect.addEventListener('change', function () {
        selectedValue = this.value; 
        showData(selectedValue);
        
        if(selectedValue == "XRP")
        {
            domLogo.src = "https://static.cryptotips.eu/wp-content/uploads/2018/01/ripple-xrp-logo.png";
        }

        if(selectedValue == "BTC")
        {
            domLogo.src = "https://btcdirect.eu/media/1108/download/Bitcoin.png?v=1";
        }

        if(selectedValue == "ETC")
        {
            domLogo.src = "https://static.cryptotips.eu/wp-content/uploads/2018/05/ethereum-classic-etc-logo-230x230.png";
        }

        if(selectedValue == "ETH")
        {
            domLogo.src = "https://etherscan.io/images/ethereum-icon.png";
        }
        
        else if(selectedValue != "BTC" && selectedValue != "ETC" && selectedValue != "XRP")
        {
            domLogo.src = "http://cpscomputers.nl/img/2ad93aa30cc10b0142223e0eedc95b0c.png";
        }

    })



    for (let button of domButtons) {
        button.classList.remove('is-selected');
        button.addEventListener('click', function () {

            buttons = document.getElementsByClassName('c-link-cta');
            for(let clink of buttons)
            {
                clink.classList.remove('is-selected');
            }


            dayscount = button.getAttribute('data-value');
            loadDataChart(selectedValue, dayscount, token);
            button.childNodes[1].classList.add('is-selected');
        })
    }

}

const init = function () {
    getDOM();
    enableListeners();
    showData("BTC");
    domLogo.src = "https://btcdirect.eu/media/1108/download/Bitcoin.png?v=1";
}


// ----------------------------------- SHOW DATA  ----------------------------------- //

const showData = function (cryptocurrency, dayscount = "7") {
    loadPrices(cryptocurrency);
    loadVolumes(cryptocurrency);
    loadDataUpdated(cryptocurrency);
    loadPricesHighLow(cryptocurrency)
}

const showPrices = function () {
    token = "";
    percentage = (1 - (valueYesterday / valueNow)) * 100;
    countUp(valueYesterday, valueNow, "js-price");

    if (percentage < 0) {
        token = "-";
        domPercentage.setAttribute("style", "color: var(--global-color-beta)")
    } else {
        token = "+";
        domPercentage.setAttribute("style", "color: var(--global-color-gamma)")
    }

    let test = 0.2;

    domPercentage.innerHTML = token + " " + Math.abs(percentage.toFixed(2)) + " %";

    loadDataChart(selectedValue, dayscount, token);
}

const showVolume = function (data) {

    let amount = "";

    volume = data.Data[10].volume.toFixed(0);
    let length = volume.toString().length;

    if (length >= 10) {
        amount = "B";;
        volume = volume / 1000000000
        volume = volume.toFixed(2);

    }

    if (length < 9 && length > 4) {
        amount = "K";
        volume = volume / 1000
        volume = volume.toFixed(2);
    }

    if (length == 9)
    {
        amount = "M";
        volume = volume / 1000000
        volume = volume.toFixed(2);
    }

    domVolume.innerHTML = volume + " " + amount;
}

const showLastUpdated = function (data, cryptocurrency) {
    let unixTime = data.RAW[cryptocurrency].EUR.LASTUPDATE

    dateObj = new Date(unixTime * 1000);

    dayNumber = dateObj.getDate();
    nameDay = days[dateObj.getDay()];
    nameMonth = months[dateObj.getMonth()]

    let stringUpdated = nameDay + " " + dayNumber + " " + nameMonth;

    domUpdated.innerHTML = stringUpdated;
}

const showRangeDaily = function (min, max) {
    domHigh.innerHTML = max;
    domLow.innerHTML = min;
}





// ----------------------------------- LOAD DATA  ----------------------------------- //


const loadPrices = function (cryptocurrency) {
    const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/price?fsym=${cryptocurrency}&tsyms=EUR`;

    fetch(urlHighMaxDaily, {
        headers: head
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        valueNow = data.EUR;
        loadHighLowPrices(cryptocurrency);
    });

}

const loadHighLowPrices = function (cryptocurrency) {
    const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptocurrency}&tsym=EUR&limit=10`;

    fetch(urlHighMaxDaily, {
        headers: head
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        valueYesterday = data.Data.Data[9].open;
        showPrices();
    });
}

const loadVolumes = function (cryptocurrency) {
    const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/exchange/histoday?tsym=${cryptocurrency}&limit=10`;

    fetch(urlHighMaxDaily, {
        headers: head
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        showVolume(data)
    });
}

const loadDataUpdated = function (cryptocurrency) {
    const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=EUR`;

    fetch(urlHighMaxDaily, {
        headers: head
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        showLastUpdated(data, cryptocurrency);
    });
}

const loadPricesHighLow = async function (cryptocurrency) {
    const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=EUR`;

    fetch(urlHighMaxDaily, {
        headers: head
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        showRangeDaily(data.DISPLAY[cryptocurrency].EUR.LOW24HOUR, data.DISPLAY[cryptocurrency].EUR.HIGH24HOUR);
    });
}



document.addEventListener('DOMContentLoaded', init)