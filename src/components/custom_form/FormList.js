import {inputConf} from "./control/Input";
import {input2Conf} from "./control/Input2";
import {radioConf} from "./control/Radio";
import {checkBoxConf} from "./control/CheckBox";
import {datePickerConf} from './control/DatePicker';
import {tableConf} from './control/TableMaker';
// import { selectConf } from "./control/Select";
// import { cascaderConf } from "./control/Cascader";
import {textConf} from "./control/Text";
import {titleConf} from "./control/Title";
// import { hrConf } from "./control/Hr";
import {pConf} from "./control/P";
// import { uploadsConf } from './control/Uploads';
import {addressConf} from './control/Address';

const formList = {
  title: titleConf,
  // hr: hrConf,
  p: pConf,
  input: inputConf,
  input2: input2Conf,
  radio: radioConf,
  checkbox: checkBoxConf,
  datepicker: datePickerConf,
  table: tableConf,
  // select: selectConf,
  // cascader: cascaderConf,
  address: addressConf,
  // uploads: uploadsConf,
  text: textConf,
};
let list_arr = [];
for (let i in formList) {
  list_arr.push({
    ele: i,
    obj: formList[i]
  });
}
export default list_arr;
