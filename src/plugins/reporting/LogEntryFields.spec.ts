import chai from 'chai';
import assert from 'assert';
import { LogEntryFields } from './LogEntryFields';

describe('LogEntryFields', () => {
    it('should serialize base object', () => {
        const val = new LogEntryFields({a:1}).serialize();
        chai.expect(val.fields).eql({a:1});
    });

    it('should serialize base object 2 length ', () => {
        const val = new LogEntryFields({a:1, b:2}).serialize();
        chai.expect(val.fields).eql({a:1, b:2});
    });

    it('should serialize base object 10 length ', () => {
        const val = new LogEntryFields({a11:1, a12:2, a13:2, a14:2, a15:2, a16:2, a17:2, a18:2, a19:2, a110:2}).serialize();
        chai.expect(val.fields).eql({a11:1, a12:2, a13:2, a14:2, a15:2, a16:2, a17:2, a18:2, a19:2, a110:2});
    });

    it('should serialize base object 11 length ', () => {
        const val = new LogEntryFields({a11:1, a12:2, a13:2, a14:2, a15:2, a16:2, a17:2, a18:2, a19:2, a110:2, a111:2}).serialize();
        chai.expect(val.fields).eql({a11:1, a12:2, a13:2, a14:2, a15:2, a16:2, a17:2, a18:2, a19:2, a110:2, __ignored: ['a111']});
    });

    it('should serialize base object 15 length ', () => {
        const val = new LogEntryFields({a11:1, a12:2, a13:2, a14:2, a15:2, a16:2, a17:2, a18:2, a19:2, a110:2, a111:2, a112:2, a113:2, a114:2, a115:2}).serialize();
        chai.expect(val.fields).eql({a11:1, a12:2, a13:2, a14:2, a15:2, a16:2, a17:2, a18:2, a19:2, a110:2, __ignored: ['a111', 'a112', 'a113', 'a114', 'a115']});
        chai.expect(val.detailsJson).eql(JSON.stringify({a11:1, a12:2, a13:2, a14:2, a15:2, a16:2, a17:2, a18:2, a19:2, a110:2, a111:2, a112:2, a113:2, a114:2, a115:2}));
    });

    it('should serialize base object 1 length and depth 1', () => {
        const val = new LogEntryFields({a:1}).serialize();
        chai.expect(val.fields).eql({a:1});
    });

    it('should serialize base object 1 length and depth 2', () => {
        const val = new LogEntryFields({a:{b:1}}).serialize();
        chai.expect(val.fields).eql({a:{b:1}});
    });

    it('should serialize base object 1 length and depth 3', () => {
        const val = new LogEntryFields({a:{b:{c:1}}}).serialize();
        chai.expect(val.fields).eql({a:{b:'{"c":1}'}});
    });

    it('should serialize base object 1 length and depth 4', () => {
        const val = new LogEntryFields({a:{b:{c:{d:1}}}}).serialize();
        chai.expect(val.fields).eql({a:{b:'{"c":{"d":1}}'}});
    });

    it('should serialize base object 2 length and depth 4', () => {
        const val = new LogEntryFields({a:{b:{c:{d:1}}}, a1:1}).serialize();
        chai.expect(val.fields).eql({a:{b:'{"c":{"d":1}}'}, a1:1});
    });
});
