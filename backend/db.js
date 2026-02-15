const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonDB {
    constructor(collection) {
        this.collection = collection;
        this.filePath = path.join(DATA_DIR, `${collection}.json`);
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
        }
    }

    read() {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    write(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    }

    findMany() {
        return this.read();
    }

    findUnique(id) {
        return this.read().find(item => item.id === parseInt(id));
    }

    async create(data) {
        const items = this.read();
        const newItem = { ...data, id: Date.now() };
        items.push(newItem);
        this.write(items);
        return newItem;
    }

    async update(id, data) {
        const items = this.read();
        const index = items.findIndex(item => item.id === parseInt(id));
        if (index === -1) return null;
        items[index] = { ...items[index], ...data };
        this.write(items);
        return items[index];
    }

    async delete(id) {
        const items = this.read();
        const filtered = items.filter(item => item.id !== parseInt(id));
        this.write(filtered);
        return true;
    }
}

module.exports = {
    users: new JsonDB('users'),
    students: new JsonDB('students'),
    fees: new JsonDB('fees'),
    circulars: new JsonDB('circulars'),
    attendance: new JsonDB('attendance'),
    results: new JsonDB('results'),
    admissions: new JsonDB('admissions'),
    photos: new JsonDB('photos'),
};
