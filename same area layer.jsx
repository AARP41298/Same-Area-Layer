function main() {
    var layers = getInfo();

    for (var i = 0; i < layers.length; i++) {
        selectById(layers[i].id);

        transform(layers[i]);

        transform(getInfo()[0]);
    }

    /////////////////////////////////////////////////////////////////////////////////////
    // funcs ////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////

    function selectById(id) {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putIdentifier(charIDToTypeID('Lyr '), id);
        desc1.putReference(charIDToTypeID('null'), ref1);
        executeAction(charIDToTypeID('slct'), desc1, DialogModes.NO);
    } // end of selectById()


    function getInfo() {
        var lyrs = [];
        var lyr, bounds;
        var ref = new ActionReference();
        var desc;
        var tempIndex;
        var ref2;
        ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("targetLayers"));
        ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));

        var targetLayers = executeActionGet(ref).getList(stringIDToTypeID("targetLayers"));
        for (var i = 0; i < targetLayers.count; i++) {
            tempIndex = 0;
            ref2 = new ActionReference();
            try {
                activeDocument.backgroundLayer;
                ref2.putIndex(charIDToTypeID('Lyr '), targetLayers.getReference(i).getIndex());
                try {
                    desc = executeActionGet(ref2);
                    tempIndex = desc.getInteger(stringIDToTypeID("itemIndex")) - 1;
                }
                catch (e) {
                    tempIndex = 0;
                }
            }
            catch (o) {
                ref2.putIndex(charIDToTypeID('Lyr '), targetLayers.getReference(i).getIndex() + 1);
                desc = executeActionGet(ref2);
                tempIndex = desc.getInteger(stringIDToTypeID("itemIndex"));
            }

            lyr = {};
            bounds = desc.getObjectValue(stringIDToTypeID("bounds"));
            lyr.id = desc.getInteger(stringIDToTypeID("layerID"));
            lyr.height = bounds.getDouble(stringIDToTypeID("height"));
            lyr.width = bounds.getDouble(stringIDToTypeID("width"));


            lyrs.push(lyr);
        }
        return lyrs

    }

    function transform(layer) {

        var areaDeseada = 60000; // pixeles cuadrados deseados
        var areaOrigen = layer.height * layer.width;
        var proporcion = Math.sqrt(areaDeseada / areaOrigen);
        var newHeight = (proporcion * layer.height) * 100 / layer.height;
        var newWidth = (proporcion * layer.width) * 100 / layer.width;



        var desc = new ActionDescriptor();
        desc.putEnumerated(charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), charIDToTypeID('Qcsa'));
        desc.putUnitDouble(charIDToTypeID('Wdth'), charIDToTypeID('#Prc'), newWidth);
        desc.putUnitDouble(charIDToTypeID('Hght'), charIDToTypeID('#Prc'), newHeight);
        executeAction(charIDToTypeID('Trnf'), desc, DialogModes.NO);
    }

}

app.activeDocument.suspendHistory("resize selected", "main()");