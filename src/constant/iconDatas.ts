import iconsName from '@/constant/iconsName.ts';
import iconsSrc from '@/constant/iconsSrc.ts';
import tagId from '@/lib/tagId.ts';
// interface iconGroup {
//   name: string;
//   src: string;
//   id: number;
//   type: 'default';
// }
const array: CreatedTags[] = [];
const iconData = () => {
    for (let i = 0; i < iconsName.length; i++) {

      const group: CreatedTags = {
        name: iconsName[i],
        src: iconsSrc[i],
        id: i + 1,
        type: 'default',

      };
      array.push(group);
      // console.log('arr',group.id)

    }
    if (JSON.parse(localStorage.getItem('iconDatas') || '[]').length === 0) {
      localStorage.setItem('iconDatas', JSON.stringify(array));
    }

    return array;
};
export default iconData();
