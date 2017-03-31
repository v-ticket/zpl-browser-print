function printByZebraBrowser(zplString) {
    BrowserPrint.getDefaultDevice('printer', function(printer) {
        if (printer != null && printer.connection != undefined) {
            sendToPrint(zplString, printer)
        }
    }, function(error_response) {
        console.log('An error occured while attempting to connect to your Zebra Printer. You may not have Zebra Browser Print installed, or it may not be running.')
    });
}

function sendToPrint(zplString, printer) {
    checkPrinterStatus(printer, function (text) {
        if (text == "Ready to Print") {

            // Send to print
            printer.send(zplString,
                function() {
                    console.log('Printing complete');
                }, function() {
                    console.log('Printing error');
                });
        }
        else {
            console.log('Error' + text)
        }
    });
}

function checkPrinterStatus(printer, finishedFunction) {
	printer.sendThenRead("~HQES",
        function(text) {
            var statuses = [];
            var ok = false;

            var is_error = text.charAt(70);
            var media    = text.charAt(88);
            var head     = text.charAt(87);
            var pause    = text.charAt(84);

            // Check each flag that prevents printing
            if (is_error == '0') {
                ok = true;
                statuses.push("Ready to Print");
            }

            if (media == '1')
                statuses.push("Paper out");

            if (media == '2')
                statuses.push("Ribbon Out");

            if (media == '4')
                statuses.push("Media Door Open");

            if (media == '8')
                statuses.push("Cutter Fault");

            if (head == '1')
                statuses.push("Printhead Overheating");

            if (head == '2')
                statuses.push("Motor Overheating");

            if (head == '4')
                statuses.push("Printhead Fault");

            if (head == '8')
                statuses.push("Incorrect Printhead");

            if (pause == '1')
                statuses.push("Printer Paused");

            if ((!ok) && (statuses.Count == 0))
                statuses.push("Error: Unknown Error");

            console.log(text);
            console.log(statuses.join());

            finishedFunction(statuses.join());
        }, function() {
            console.log('Printing error');
        });
}


