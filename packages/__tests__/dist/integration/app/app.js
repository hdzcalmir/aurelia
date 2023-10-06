import { Camera, Zoom } from './molecules/specs-viewer/camera-specs-viewer.js';
import { Laptop, Storage } from './molecules/specs-viewer/laptop-specs-viewer.js';
import { User } from './molecules/user-preference/user-preference.js';
export class App {
    constructor() {
        this.text1 = 'text1';
        this.text2 = 'text2';
        this.text3 = 'text3';
        this.text4 = 'foo';
        this.text5 = 'bar';
        this.inputOneTime = 'input1';
        this.inputTwoWay = 'input2';
        this.inputToView = 'input3';
        this.inputFromView = 'input4';
        this.inputBlrTw = 'input5';
        this.inputBlrFv = 'input6';
        this.things = [new Camera(new Zoom(40, 4), [125, 1600, 3200, 6400], [4, 16], [3, 6.5], 'Coolpix B500', 'Nikon'), new Laptop('Core i5 3.40 GHz', '8GB DDR4', new Storage('SSD', 1, 'TB'), '14 inch', 'T460', 'Lenovo')];
        // computed
        this.user = new User('John', 'Doe', 0.1, 'Role1', 'Org1', 'City1', 'Country1');
        // #region checked, map, repeat
        this.contacts1 = new Map([[123456790, 'mobile'], [9087654321, 'work'], [1122334455, 'home']]);
        this.contacts2 = new Map(Array.from(this.contacts1));
        this.chosenContact1 = 9087654321;
        this.chosenContact2 = 9087654321;
        this.contacts3 = Array.from(this.contacts1).map(([number, type]) => ({ number, type }));
        this.chosenContact3 = this.contacts3[0];
        this.contacts4 = this.contacts3.slice();
        this.chosenContact4 = { number: 123456790, type: 'mobile' };
        this.contacts5 = this.contacts3.slice();
        this.chosenContact5 = { number: 123456790, type: 'mobile' };
        this.matcher = (a, b) => a.type === b.type && a.number === b.number;
        this.contacts6 = this.contacts5.map(({ number, type }) => `${number}-${type}`);
        this.chosenContact6 = this.contacts6[0];
        this.contacts7 = this.contacts6.slice();
        this.chosenContact7 = this.contacts7[0];
        this.noDisplayValue = "Don't care";
        this.trueValue = 'Yes';
        this.falseValue = 'No';
        this.products1 = [{ id: 0, name: 'Motherboard' }, { id: 1, name: 'CPU' }, { id: 2, name: 'Memory' }];
        this.chosenProducts1 = [this.products1[0]];
        this.products2 = this.products1.slice();
        this.chosenProducts2 = [{ id: 0, name: 'Motherboard' }];
        this.productMatcher = (a, b) => a.id === b.id && a.name === b.name;
        // #endregion
        this.somethingDone = false;
        // #region select
        this.items1 = [{ id: 0, displayText: 'Motherboard' }, { id: 1, displayText: 'CPU' }, { id: 2, displayText: 'Memory' }];
        this.selectedItem1 = 0;
        this.items2 = this.items1.map(({ id, displayText: name }) => ({ id: { id, name }, displayText: name }));
        this.selectedItem2 = this.items2[0].id;
        this.items3 = this.items2.slice();
        this.selectedItem3 = { id: 0, name: 'Motherboard' };
        this.optionMatcher = (a, b) => !!a && !!b && a.id === b.id;
        this.items4 = this.items1.map(({ id, displayText }) => ({ id: id.toString(), displayText }));
        this.selectedItem4 = this.items4[0].id;
        this.selectedItems1 = [0];
        this.selectedItems2 = [this.items2[0].id];
        this.selectedItems3 = [{ id: 0, name: 'Motherboard' }];
        this.selectedItems4 = [this.items4[0].id];
        // #endregion
        this.heroes = [
            { imgSrc: "hero1.jpg", header: 'Iron Man', details: 'Inventor Tony Stark applies his genius for high-tech solutions to problems as Iron Man, the armored Avenger.' },
            { imgSrc: "hero2.jpg", header: 'Captain America', details: 'America’s World War II Super-Soldier continues his fight in the present as an Avenger and untiring sentinel of liberty.' },
            { imgSrc: "hero3.jpg", header: 'Hulk', details: 'Exposed to heavy doses of gamma radiation, scientist Bruce Banner transforms into the mean, green rage machine called the Hulk.' },
            { imgSrc: "hero4.jpg", header: 'Spider-Man', details: 'With amazing spider-like abilities, teenage science whiz Peter Parker fights crime and dreams of becoming an Avenger as Spider-Man.' },
            { imgSrc: "hero5.jpg", header: 'Thor', details: 'Thor Odinson wields the power of the ancient Asgardians to fight evil throughout the Nine Realms and beyond.' }
        ];
        this.selectedHero = this.heroes[0];
    }
    changeTexts() {
        this.text1 = 'newText1';
        this.text2 = 'newText2';
        this.text3 = 'newText3';
    }
    doSomething() {
        this.somethingDone = true;
    }
}
//# sourceMappingURL=app.js.map