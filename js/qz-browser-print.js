function printByQZ(zplString) {
    qz.websocket.connect()
        .then(function() {
            console.log('Connected!');

            qz.printers.getDefault()
                .then(function(printer) {
                    console.log(printer);

                    var config = qz.configs.create(printer);    // Create a default config for the found printer
                    var data = [zplString];                     // Raw commands (ZPL provided)

                    qz.print(config, data)
                        .then(function() {
                            console.log('Sent data to printer');
                        })
                        .catch(function(e) {
                            console.error(e);
                        });

                })
                .catch(function(e) {
                    console.error(e);
                });
        })
        .catch(function(e) {
            console.error(e);
        });
}
