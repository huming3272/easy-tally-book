import iconsName from '@/constant/iconsName.ts';
import iconsSrc from '@/constant/iconsSrc.ts';
interface iconGroup {
  name: string;
  src: string;
}
const array: iconGroup[] = [];
const iconData = () => {
    for (let i = 0; i < iconsName.length; i++) {
      const group = {
        name: iconsName[i],
        src: iconsSrc[i],
      };
      array.push(group);
    }
    return array;
};
export default iconData();
