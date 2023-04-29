import { lineup } from "./lineup"
import { Member } from "./member";

const storage = (() => {

    const setStorage = () => {
        localStorage.setItem("lineup", JSON.stringify(lineup.getLineup()));
    }

    const getStorage = () => {
        let item = localStorage.getItem("lineup");

        if (item != null) {
            let members = JSON.parse(item);
            for (let i = 0; i < members.length; i++) {
                let oldMember = members[i];
                if (oldMember != null) {
                    let newMember = new Member(oldMember.name, oldMember.memberTH, oldMember.opponentTH);
                    newMember.capabilities = oldMember.capabilities;
                    lineup.addMember(newMember, i + 1);
                }

            }
        }

        else 
        {
            addDefaultMembers();
        }
    }

    const addDefaultMembers = () => {
        let m1 = new Member('North', '15-', 15);
        let m2 = new Member('Kam', '15-', 15);
        let m3 = new Member('Sparker', '15-', 15);
        let m4 = new Member('Sim', '15-', 15);
        let m5 = new Member('Womps', '15-', 15);
        let m6 = new Member('Park', '13-', 13);
        let m7 = new Member('Jose', '14-', 14);
        let m8 = new Member('Hydro', '13+', 13);
        let m9 = new Member('Vik', '13+', 13);
        let m10 = new Member('Miller', '13-', 13);
        let m11 = new Member('Aoja', '13+', 13);
        let m12 = new Member('Risk', '13+', 13);
        let m13 = new Member('H2', '13+', 13);
        let m14 = new Member('Thinking', '13+', 13);
        let m15 = new Member('Wizard', '13+', 13);
        let m16 = new Member('Pink', '12-', 12);
        let m17 = new Member('Stephen', '12+', 12);
        let m18 = new Member('Superman', '12-', 12);
        let m19 = new Member('Verit', '12-', 12);
        let m20 = new Member('Coffee', '12-', 12);
        let m21 = new Member('Kurz', '12+', 12);
        let m22 = new Member('Thunder', '12-', 12);
        let m23 = new Member('Rob', '12-', 12);
        let m24 = new Member('Rize', '12-', 12);
        let m25 = new Member('Hulk', '12+', 12);
        let m26 = new Member('Quank', '12+', 12);
        let m27 = new Member('Shonnen', '12+', 12);
        let m28 = new Member('Havik', '12+', 12);
        let m29 = new Member('Peezy', '12-', 12);
        let m30 = new Member('LilDro', '12+', 12);
        lineup.addMember(m1, 1)
        lineup.addMember(m2, 2)
        lineup.addMember(m3, 3)
        lineup.addMember(m4, 4)
        lineup.addMember(m5, 5)
        lineup.addMember(m6, 6)
        lineup.addMember(m7, 7)
        lineup.addMember(m8, 8)
        lineup.addMember(m9, 9)
        lineup.addMember(m10, 10)
        lineup.addMember(m11, 11)
        lineup.addMember(m12, 12)
        lineup.addMember(m13, 13)
        lineup.addMember(m14, 14)
        lineup.addMember(m15, 15)
        lineup.addMember(m16, 16)
        lineup.addMember(m17, 17)
        lineup.addMember(m18, 18)
        lineup.addMember(m19, 19)
        lineup.addMember(m20, 20)
        lineup.addMember(m21, 21)
        lineup.addMember(m22, 22)
        lineup.addMember(m23, 23)
        lineup.addMember(m24, 24)
        lineup.addMember(m25, 25)
        lineup.addMember(m26, 26)
        lineup.addMember(m27, 27)
        lineup.addMember(m28, 28)
        lineup.addMember(m29, 29)
        lineup.addMember(m30, 30)
    }

    return {
        getStorage,
        setStorage
    }
})();

export {storage}
