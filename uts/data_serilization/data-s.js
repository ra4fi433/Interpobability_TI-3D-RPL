const express = require('express');
const xml2js = require('xml2js');
const protobuf = require('protobufjs');
const avro = require('avsc');

const app = express();
const PORT = 3006;

// Data awal
const data = {
    nama: 'Andi',
    umur: 25,
    status: 'Aktif'
};

// Endpoint utama
app.get('/serialization', (req, res) => {
    // JSON
    const jsonData = JSON.stringify(data, null, 2);

    // XML
    const builder = new xml2js.Builder({
        rootName: 'person'
    });
    const xmlData = builder.buildObject(data);

    // Protobuf
    const PersonProto = new protobuf.Type('Person')
        .add(new protobuf.Field('nama', 1, 'string'))
        .add(new protobuf.Field('umur', 2, 'int32'))
        .add(new protobuf.Field('status', 3, 'string'));

    const protoMessage = PersonProto.create(data);
    const protoBuffer = PersonProto.encode(protoMessage).finish();

    // Avro
    const PersonAvro = avro.Type.forSchema({
        type: 'record',
        name: 'Person',
        fields: [
            { name: 'nama', type: 'string' },
            { name: 'umur', type: 'int' },
            { name: 'status', type: 'string' }
        ]
    });

    const avroBuffer = PersonAvro.toBuffer(data);

    // Response JSON untuk Postman
    res.json({
        originalData: data,
        json: JSON.parse(jsonData),
        xml: xmlData,
        sizeComparison: {
            json: Buffer.byteLength(jsonData, 'utf8') + ' bytes',
            xml: Buffer.byteLength(xmlData, 'utf8') + ' bytes',
            protobuf: protoBuffer.length + ' bytes',
            avro: avroBuffer.length + ' bytes'
        },
        analysis: {
            bestForRestApi: 'JSON',
            mostEfficientForHighPerformance: 'Protobuf / Avro',
            reasons: [
                'JSON adalah standar de facto untuk REST API.',
                'JSON mudah dibaca manusia dan didukung luas.',
                'Protobuf dan Avro menggunakan format biner.',
                'Protobuf dan Avro menghasilkan ukuran data lebih kecil.',
                'Protobuf dan Avro memiliki proses parsing lebih cepat.'
            ]
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});