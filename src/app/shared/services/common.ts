import * as moment from 'moment';
import { CookieOptions } from '../models/common.model';

export class Common {

	constructor() { }

	/**
	 * @description To check a datatype.
	 * @param {any} data Type will be check for this variable.
	 * @return {datatype} number, object, etc.
	 */
	typeOf(data: any) {
		return typeof data;
	}

	/**
	 * @description Merging two JSON object.
	 * @param {json} source Source JSON object.
	 * @param {json} data JSON object which is to be merged with source JSON object.
	 * @return {json} Merged JSON object.
	 */
	JSONMerge(source: object, data: object): any {
		const sourceVal: any = Object.assign({}, source);
		const dataVal: any = Object.assign({}, data);
		if (![null, undefined].includes(sourceVal) && ![null, undefined].includes(dataVal)) {
			for (const key in dataVal) {
				if (
					typeof sourceVal === 'object' &&
					sourceVal.hasOwnProperty(key) &&
					typeof sourceVal[key] === 'object' &&
					!Array.isArray(sourceVal[key])
				) {
					sourceVal[key] = this.JSONMerge(sourceVal[key], dataVal[key]);
				} else if (typeof sourceVal === 'object') {
					sourceVal[key] = dataVal[key];
				}
			}
		}

		return sourceVal;
	}

	/**
	 * This function is to Validate & remove undefined and return json data
	 * @param {Object} data is an object
	 */
	JSONBuilder(data: any = {}, skippable = [undefined]) {
		let returnData: any = {};
		Object.keys(data).map((key) => {
			if (!skippable.includes(data[key])) {
				if (![null].includes(data[key]) && typeof data[key] === 'object' && !Array.isArray(data[key])) {
					returnData[key] = this.JSONBuilder(data[key]);
				} else {
					returnData[key] = data[key];
				}
			}
		});
		return returnData;
	}

	/**
   * @description Round up the given number.
   * @param {number} value that to be processed.
   * @param {number} precision Decimal digit length.
   * @return {number} Rounded value.
   */
	precisionRound(value: number, precision: number = 2) {
		const data = Math.pow(10, precision);
		return Math.round(value * data) / data || 0;
	}

	/**
   * @description Round up the number by forcing to return with float point.
   * @param {number} value that to be processed.
   * @param {number} precision Decimal digit length.
   * @return {number} Rounded value.
   */
	precisionRoundFloat(value: number, precision: number = 2) {
		const finalValue = this.precisionRound(value).toString();
		return parseFloat(finalValue).toFixed(precision);
	}

	/**
   * @description To get given value in preferred currency format.
   * @param {number} value that to be processed.
   * @return {string} Currency format value.
   */
	precisionRoundCurrency(value: number) {
		const finalValue = this.precisionRound(value);
		return finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	/**
   * @description To check whether the given value is json or not
   * @param {any} item data to check whether json or not.
   * @return {boolean} true / false.
   */
	isJson(item: JSON | string) {
		item = typeof item !== 'string' ? JSON.stringify(item) : item;
		try {
			item = JSON.parse(item);
		} catch (e) {
			return false;
		}

		if (typeof item === 'object' && item !== null) {
			return true;
		}

		return false;
	}

	/**
   * @description After the validation, values will be converted into FormData if needed.
   * @param {json} apiValues form values.
   * @return {FormData} Modified form values to FormData.
   */
	convertToFormData(apiValues: any): FormData {
		const formData = new FormData();
		for (const key of Object.keys(apiValues)) {
			let value = apiValues[key];
			if (Array.isArray(value)) {
				value = JSON.stringify(value);
			} else if (value && typeof value === 'object' && Object.keys(value).length) {
				value = JSON.stringify(value);
			}
			formData.append(key, value);
		}
		return formData;
	}

	/**
* @description To get difference between given two dates.
* @param {date} from From date.
* @param {date} to To date.
* @param {string} preference Preferred period.
* @return {string} Altered value.
*/
	dateDif(from: any, to: any, preference = null, accurate = true, format = 'YYYY-MM-DD HH:MM:SS') {
		if (typeof new Date(to) === 'object') to = new Date(to).getTime();
		if (typeof new Date(from) === 'object') from = new Date(from).getTime();
		if (![null, '', undefined].includes(preference)) {
			if (preference === 'second') {
				to = moment(to);
				from = moment(from);
				return to.diff(from, 'seconds', accurate);
			} else if (preference === 'minute') {
				to = moment(to);
				from = moment(from);
				return to.diff(from, 'minutes', accurate);
			} else if (preference === 'hour') {
				to = moment(to);
				from = moment(from);
				return to.diff(from, 'hours', accurate);
			} else if (preference === 'day') {
				to = moment(moment(to).format(format));
				from = moment(moment(from).format(format));
				return to.diff(from, 'days', accurate);
			} else if (preference === 'month') {
				to = moment(moment(to).format(format));
				from = moment(moment(from).format(format));
				return to.diff(from, 'months', accurate);
			} else if (preference === 'year') {
				to = moment(moment(to).format(format));
				from = moment(moment(from).format(format));
				return to.diff(from, 'years', accurate);
			} else {
				to = moment(moment(to).format(format));
				from = moment(moment(from).format(format));
				return to.diff(from, 'days', accurate);
			}
		} else {
			to = moment(moment(to).format(format));
			from = moment(moment(from).format(format));
			return to.diff(from, 'days', accurate);
		}
	}


	/**
   * @description To get difference between given two dates.
   * @param {timestamp} from From date.
   * @param {timestamp} to To date.
   * @param {string} preference Preferred period.
   * @return {string} Altered value.
   */
	dateDifference(from: number, to: number, preference = null) {
		const dateDiff = this.fullDateDiff(from, to, 4, false);
		const dateDiffArr = dateDiff.returnString.replace(/, /gi, ',').split(',');
		let days = '0';
		let months = '0';
		let years = '0';
		if (typeof dateDiffArr === 'object' && dateDiffArr.length) {
			dateDiffArr.map((resp) => {
				if (resp.match(/(day)/)) {
					days = resp.replace(/[a-zA-z&\/\\#,+()$~%.'':*?<>{}@!=|;^-]/gi, '').trim();
				} else if (resp.match(/(month)/)) {
					months = resp.replace(/[a-zA-z&\/\\#,+()$~%.'':*?<>{}@!=|;^-]/gi, '').trim();
				} else if (resp.match(/(year)/)) {
					years = resp.replace(/[a-zA-z&\/\\#,+()$~%.'':*?<>{}@!=|;^-]/gi, '').trim();
				}
			});
		}

		if (months) {
			years = years + '.' + months;
		}

		if (preference === 'day') {
			return {
				days,
				isPast: dateDiff.past
			};
		} else if (preference === 'month') {
			return {
				months,
				isPast: dateDiff.past
			};
		} else if (preference === 'year') {
			return {
				years,
				isPast: dateDiff.past
			};
		} else {
			return {
				days,
				isPast: dateDiff.past
			};
		}
	}


	/**
* @description Resetting the form / control.
* @param {string} id - Key value of format.
* @param {array} params.
* @return {string} Altered value.
*/
	fullDateFormat(id: string, params: Array<any> = []) {
		const lang: any = {
			'date.past': '{0} ago',
			'date.future': 'in {0}',
			'date.now': 'now',
			'date.year': '{0} year',
			'date.years': '{0} years',
			'date.years.prefixed': '{0} years',
			'date.month': '{0} month',
			'date.months': '{0} months',
			'date.months.prefixed': '{0} months',
			'date.day': '{0} day',
			'date.days': '{0} days',
			'date.days.prefixed': '{0} days',
			'date.hour': '{0} hour',
			'date.hours': '{0} hours',
			'date.hours.prefixed': '{0} hours',
			'date.minute': '{0} minute',
			'date.minutes': '{0} minutes',
			'date.minutes.prefixed': '{0} minutes',
			'date.second': '{0} second',
			'date.seconds': '{0} seconds',
			'date.seconds.prefixed': '{0} seconds'
		};
		let returnValue = lang[id] || '';
		if (params) {
			for (let i = 0; i < params.length; i++) {
				returnValue = returnValue.replace('{' + i + '}', params[i]);
			}
		}
		return returnValue;
	}

	/**
   * @description To get difference between given two dates.
   * @param {timestamp} fromDate From date.
   * @param {timestamp} toDate To date.
   * @param {string} levels 1 to 4.
   * @param {string} prefix true / false.
   * @return {string} Altered value.
   */
	fullDateDiff(fromDate: number, toDate: number, levels: number, prefix: boolean) {
		const newToDate = toDate ? toDate : Date.now();
		let diff = fromDate - newToDate;
		const past = diff < 0 ? true : false;
		diff = diff < 0 ? diff * -1 : diff;
		const date = new Date(new Date(1970, 0, 1, 0).getTime() + diff);
		let returnString = '';
		let count = 0;
		const years = date.getFullYear() - 1970;
		if (years > 0) {
			const langSingle = 'date.year' + (prefix ? '' : '');
			const langMultiple = 'date.years' + (prefix ? '.prefixed' : '');
			returnString +=
				(count > 0 ? ', ' : '') +
				(years > 1 ? this.fullDateFormat(langMultiple, [years]) : this.fullDateFormat(langSingle, [years]));
			count++;
		}
		const months = date.getMonth();
		if (count < levels && months > 0) {
			const langSingle = 'date.month' + (prefix ? '' : '');
			const langMultiple = 'date.months' + (prefix ? '.prefixed' : '');
			returnString +=
				(count > 0 ? ', ' : '') +
				(months > 1
					? this.fullDateFormat(langMultiple, [months])
					: this.fullDateFormat(langSingle, [months]));
			count++;
		} else {
			if (count > 0) {
				count = 99;
			}
		}
		const days = date.getDate() - 1;
		if (count < levels && days > 0) {
			const langSingle = 'date.day' + (prefix ? '' : '');
			const langMultiple = 'date.days' + (prefix ? '.prefixed' : '');
			returnString +=
				(count > 0 ? ', ' : '') +
				(days > 1 ? this.fullDateFormat(langMultiple, [days]) : this.fullDateFormat(langSingle, [days]));
			count++;
		} else {
			if (count > 0) {
				count = 99;
			}
		}
		const hours = date.getHours();
		if (count < levels && hours > 0) {
			const langSingle = 'date.hour' + (prefix ? '' : '');
			const langMultiple = 'date.hours' + (prefix ? '.prefixed' : '');
			returnString +=
				(count > 0 ? ', ' : '') +
				(hours > 1 ? this.fullDateFormat(langMultiple, [hours]) : this.fullDateFormat(langSingle, [hours]));
			count++;
		} else {
			if (count > 0) {
				count = 99;
			}
		}
		const minutes = date.getMinutes();
		if (count < levels && minutes > 0) {
			const langSingle = 'date.minute' + (prefix ? '' : '');
			const langMultiple = 'date.minutes' + (prefix ? '.prefixed' : '');
			returnString +=
				(count > 0 ? ', ' : '') +
				(minutes > 1
					? this.fullDateFormat(langMultiple, [minutes])
					: this.fullDateFormat(langSingle, [minutes]));
			count++;
		} else {
			if (count > 0) {
				count = 99;
			}
		}
		const seconds = date.getSeconds();
		if (count < levels && seconds > 0) {
			const langSingle = 'date.second' + (prefix ? '' : '');
			const langMultiple = 'date.seconds' + (prefix ? '.prefixed' : '');
			returnString +=
				(count > 0 ? ', ' : '') +
				(seconds > 1
					? this.fullDateFormat(langMultiple, [seconds])
					: this.fullDateFormat(langSingle, [seconds]));
			count++;
		} else {
			if (count > 0) {
				count = 99;
			}
		}
		if (prefix) {
			if (returnString === '') {
				returnString = this.fullDateFormat('date.now');
			} else if (past) {
				returnString = this.fullDateFormat('date.past', [returnString]);
			} else {
				returnString = this.fullDateFormat('date.future', [returnString]);
			}
		}
		return {
			returnString,
			past
		};
	}

	/**
* @description Convert the json object to query string.
* @param {JSON} obj Json object that to be processed.
* @param {string} separator separating the data using this value
* @param {string} prefix prefix string of object key.
* @return {string} query string.
*/
	objectToQuerystring(obj: any, separator = '&', prefix = null, type = 'URL') {
		return Object.keys(obj).filter((key) => ![null, undefined].includes(obj[key])).reduce((str, key, i) => {
			let delimiter;
			let val;
			delimiter = i === 0 ? '' : separator;
			if (Array.isArray(obj[key])) {
				key = encodeURIComponent(key);
				const arrayVar = obj[key].reduce((innerStr: string, item: any) => {
					if (type === 'FORM') {
						val = encodeURIComponent(JSON.stringify(item));
					} else {
						val = encodeURIComponent(item);
					}
					return [innerStr, key, '=', val, '&'].join('');
				}, '');
				return [str, delimiter, arrayVar.trimRightString('&')].join('');
			} else {
				key = encodeURIComponent(key);
				if (type === 'FORM') {
					val = encodeURIComponent(JSON.stringify(obj[key]));
				} else {
					val = encodeURIComponent(obj[key]);
				}
				if (prefix) {
					key = prefix + '.' + key;
				}
				return [str, delimiter, key, '=', decodeURIComponent(val)].join('');
			}
		}, '');
	}

	jsonStringify(value: any) {
		let returnData = `{`;
		Object.keys(value).map((key: any, index: number) => {
			returnData += `"${key}":`;
			if (typeof value[key] === 'number') {
				returnData += `${value[key]}`;
			} else {
				returnData += `"${value[key]}"`;
			}
			if (Object.keys(value).length > index + 1) {
				returnData += `,`;
			}
		});
		returnData += `}`;
		return returnData;
	}
	/**	
	 * @description Get cookie data.	
	 * @param {string} name Cookie name.	
	 * @return {json} Cookie data as a json.	
	 */
	getCookie(name: string) {
		try {
			// if (name === 'token') {
			// 	return 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInNlc3Npb25JRCI6IjEtMTYyODg1MDIxMDc5NSIsImxvZ2luSUQiOiJhZG1pbkB1bmltaXR5LmNvbSIsImRvbWFpbklEIjoicGVkZXYiLCJpYXQiOjE2Mjg4NTAyMTAsImV4cCI6MTYzMTQ0MjIxMH0.kLYhrzr6MY5XqT256n0HbRGFC9f9vsUYKse2IWqbKfc';
			// }
			const ca: Array<string> = decodeURIComponent(document.cookie).split(';');
			const caLen: number = ca.length;
			const cookieName = `${name}=`;
			let c: string;
			for (let i = 0; i < caLen; i += 1) {
				c = ca[i].replace(/^\s+/g, '');
				if (c.indexOf(cookieName) === 0) {
					const returnData = c.substring(cookieName.length, c.length);
					if (returnData) {
						if (this.isJson(returnData)) {
							return JSON.parse(returnData);
						}
						return returnData;
					}
				}
			}
		} catch (err) {
			return null;
		}
	}

	/**
	 * @description Delete cookie data.
	 * @param {string} name Cookie name.
	 */
	deleteCookie(name: string): void {
		this.setCookie(name, '', { expire: -1 });
	}


	/**	
	 * @description Set cookie data.	
	 * @param {string} name Cookie name.	
	 * @param {any} value Cookie value.	
	 * @param {CookieOptions} options Cookie options.	
	 */
	setCookie(name: string, value: any, options?: CookieOptions): void {
		if (options && options.expire) {
			const d: Date = new Date();
			d.setTime(d.getTime() + options.expire);
			const expires = `expires=${d.toUTCString()}`;
			if (this.isJson(value)) {
				value = JSON.stringify(value);
			}
			document.cookie = `${name}=${value}; ${expires}`;
		} else {
			document.cookie = `${name}=${value};`;
		}
	}


	/**
 * @description To get the unique array based on property.
 * @param {Array} array data.
 * @param {key} string property.
 * @returns {Array} Unique array.
 */
	getUniqueArray(array: any[], key: string) {
		let unique = new Set();
		return array.filter((item) => {
			let k = item[key];
			return unique.has(k) ? false : unique.add(k);
		});
	}


	/**	
 * @description Download the file.	
 * @param {String} string file name.	
 * @param {String} string file type.	
 * @returns {Array} Record.	
 */
	downloadFile(fileName: string, fileType: string, record: Array<any>) {
		if (record.length === 0) {
			throw new Error('Record should be array of object');
		} else if (fileName === '') {
			throw new Error('File name should be string');
		} else if (fileType === '') {
			throw new Error('File type should be string');
		}
		if (fileType === 'csv') {
			const csvData = this.convertToCSV(record);
			const csvElement = document.createElement('a');
			csvElement.setAttribute('style', 'display:none;');
			document.body.appendChild(csvElement);
			const blob = new Blob([csvData], { type: 'text/csv' });
			const url = window.URL.createObjectURL(blob);
			csvElement.href = url;
			csvElement.download = `${fileName}.${fileType}`;
			csvElement.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(csvElement);
		}
	}

	removeDuplicateArr(arr: any[]) {
		let obj: any = {};
		for (let i = 0; i < arr.length; i++) {
			obj[arr[i]] = true;
		}
		arr = [];
		for (let key in obj) {
			arr.push(key);
		}
		return arr;
	}

	/**
   * @description Convert array of data into csv data.
   * @returns {Array} Record.
   */
	convertToCSV(objArray: any) {
		const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
		let str = '';
		let row = '';
		Object.keys(objArray[0]).map((key) => {
			row += key + ',';
		});
		row = row.slice(0, -1);
		str += row + '\r\n';
		for (const data of array) {
			let line = '';
			Object.keys(data).map((key) => {
				let recordData = data[key];
				if (typeof data[key] === 'string') {
					recordData = '"' + data[key] + '"';
				}
				if (line !== '') {
					line += ',';
				}
				line += recordData;
			});
			str += line + '\r\n';
		}
		return str;
	}

	/**
	* @description Convert the XML to json object.
	* @param {XML} xml XML data that to be processed.
	* @return {JSON} JSON object.
	*/
	xmlToJson(xml: any) {
		if (typeof xml === 'string') {
			const parser = new DOMParser();
			xml = parser.parseFromString(xml, 'text/xml');
		}

		// Create the return object
		let obj: any = {};

		if (xml.nodeType == 1) {
			// element
			// do attributes
			if (xml.attributes.length > 0) {
				obj['@attributes'] = {};
				for (let j = 0; j < xml.attributes.length; j++) {
					let attribute = xml.attributes.item(j);
					obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (xml.nodeType == 3) {
			// text
			obj = xml.nodeValue;
		}

		// do children
		if (xml.hasChildNodes()) {
			for (let i = 0; i < xml.childNodes.length; i++) {
				const item = xml.childNodes.item(i);
				const nodeName = item.nodeName;
				if (typeof obj[nodeName] === 'undefined') {
					obj[nodeName] = this.xmlToJson(item);
				} else {
					if (typeof obj[nodeName].push === 'undefined') {
						const old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(this.xmlToJson(item));
				}
			}
		}
		return obj;
	}

	getUTCOffset(date: Date, type = 'STRING') {
		const pad = (value: number) => {
			return value < 10 ? '0' + value : value;
		};
		const sign = date.getTimezoneOffset() > 0 ? '-' : '+';
		const offset = Math.abs(date.getTimezoneOffset());
		const hours = pad(Math.floor(offset / 60));
		const minutes = pad(offset % 60);
		if (type === 'JSON') {
			return {
				sign,
				hours,
				minutes
			};
		} else {
			return sign + hours + ':' + minutes;
		}
	}

	async fileToDataURL(event: any) {
		return new Promise((resolve, reject) => {
			let file: File = event;
			if (event.target) {
				const target = event.target;
				const fileList: FileList = target.files;
				file = fileList[0];
			}
			if (file) {
				const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = async () => {
					// if (['jpg', 'jpeg', 'png'].includes(ext)) {
					if (reader.result) {
						const result: string = reader.result.toString();
						resolve(result);
					} else {
						reject('File is invalid.');
					}
					// }
				};
			} else {
				reject('File is required.');
			}
		});
	}

	/**	
	 * @description Detect card type.	
	 * @param {number | string} value card number.	
	 * @returns {string} Card Type.	
	 */
	detectCardType(value: number | string): void | string {
		const re: any = {
			// electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,	
			maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
			// dankort: /^(5019)\d+$/,	
			// interpayment: /^(636)\d+$/,	
			// unionpay: /^(62|88)\d+$/,	
			visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
			mastercard: /^5[1-5][0-9]{14}$/,
			amex: /^3[47][0-9]{13}$/,
			diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
			discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
			jcb: /^(?:2131|1800|35\d{3})\d{11}$/
		};
		for (const key in re) {
			if (re[key].test(value.toString())) {
				return key;
			}
		}
	}

	formatBytes(bytes: number) {
		let si = true;
		var thresh = si ? 1000 : 1024;
		if (Math.abs(bytes) < thresh) {
			return bytes + ' B';
		}
		var units = si
			? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
			: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
		var u = -1;
		do {
			bytes /= thresh;
			++u;
		} while (Math.abs(bytes) >= thresh && u < units.length - 1);
		return bytes.toFixed(1) + ' ' + units[u];
	}

	regexRange(from: number, to: number, isRegex = true) {
		if (from < 0 || to < 0) {
			throw new Error('Negative values not supported');
		}
		if (from > to) {
			throw new Error('Invalid range from..to, from > to');
		}
		const ranges = [];
		ranges.push(from);
		let increment = 1;
		let next = from;
		let higher = true;
		while (true) {
			next += increment;
			if (next + increment > to) {
				if (next <= to) {
					ranges.push(next);
				}
				increment /= 10;
				higher = false;
			} else {
				if (next % (increment * 10) === 0) {
					ranges.push(next);
					increment = higher ? increment * 10 : increment / 10;
				}
			}
			if (!higher && increment < 10) {
				break;
			}
		}
		ranges.push(to + 1);
		let regex = isRegex ? '/^(?:' : '(?:';
		for (let i = 0; i < ranges.length - 1; i++) {
			let strFrom: any = ranges[i];
			strFrom = strFrom.toString();
			let strTo: any = ranges[i + 1] - 1;
			strTo = strTo.toString();
			for (let j = 0; j < strFrom.length; j++) {
				if (strFrom[j] === strTo[j]) {
					regex += strFrom[j];
				} else {
					regex += '[' + strFrom[j] + '-' + strTo[j] + ']';
				}
			}
			regex += '|';
		}
		if (isRegex) {
			return regex.substr(0, regex.length - 1) + ')$/';
		} else {
			return regex.substr(0, regex.length - 1) + ')';
		}
	}

	windowNavigate(url: string, target: '_blank' | '_parent' | '_self' | '_top' = '_blank') {
		let convertedURL = url.toString();
		if (!convertedURL.match('^(http|https)://')) {
			url = `http://${url}`;
		}
		window.open(url, target);
	}

	/**	
	 * @description To get the count in 1k,1m.	
	 * @param {count} Integer property.	
	 * @returns {abbreviateValue} sting.	
	 */
	abbreviateNumber(value: number, precision: number = 1) {
		let abbreviateValue: any = value;
		if (value >= 1000000) {
			abbreviateValue = `${(value / 1000000).toFixed(precision)}m`;
		} else if (value >= 1000) {
			abbreviateValue = `${(value / 1000).toFixed(precision)}k`;
		}
		return abbreviateValue;
	}

	getTimeToSeconds(time: string, additionalInfo: any = {}): void | number {
		if (!additionalInfo.timeFormat) {
			additionalInfo.timeFormat = 'h:mm:ss';
		}
		if (!additionalInfo.duration) {
			additionalInfo.duration = 'seconds';
		}
		const getDuration = moment(time, additionalInfo.timeFormat);
		if (additionalInfo.duration === 'seconds') {
			return getDuration.diff(moment().startOf('day'), 'seconds');
		} else if (additionalInfo.duration === 'minutes') {
			return getDuration.diff(moment().startOf('day'), 'minutes');
		}
	}

	getEstimatedReadingTime(wordsCount: number, timeFormat = 'hh:mm:ss') {
		const avgWPM = 200;
		const durationInMinutes = Math.round(wordsCount / avgWPM);
		console.log(durationInMinutes, wordsCount)
		let totalDuration: any = 0;
		const duration = 60 * durationInMinutes;
		totalDuration = this.formatTime(duration, timeFormat);
		return totalDuration;
	}

	formatTime(timeInSeconds: number, timeFormat = 'h:m:ss') {
		// Hours, minutes and seconds
		const hrs = ~~(timeInSeconds / 3600);
		const mins = ~~((timeInSeconds % 3600) / 60);
		const secs = ~~timeInSeconds % 60;
		const formats = timeFormat.split(':');

		let ret = '';
		if (hrs > 0) {
			const hours = (formats.includes('hh')) ? ((hrs < 10) ? `0${hrs}` : hrs) : hrs;
			ret += '' + hours + ':';
		} else if (formats.includes('hh')) {
			ret += '00:';
		}


		const minutes = (formats.includes('mm')) ? ((mins < 10) ? `0${mins}` : mins) : mins;

		const seconds = (formats.includes('ss')) ? ((secs < 10) ? `0${secs}` : secs) : secs;

		if (formats.includes('ss')) {
			ret += '' + minutes + ':' + seconds;
		} else {
			ret += '' + minutes;
		}

		return ret;
	}

	getDateDifference(past: boolean, type: 'days' | 'months' | 'years', duration: number, fromDate: Date) {
		let alteredDate;
		if (!fromDate) {
			fromDate = new Date();
		}
		const targetedDate = moment(fromDate).format('YYYY-MM-DD');
		if (past) {
			alteredDate = moment(targetedDate).subtract(duration, type).startOf('day').valueOf();
		} else {
			alteredDate = moment(targetedDate).add(duration, type).endOf('day').valueOf();
		}
		return alteredDate;
	}

	/**
   * @desc Alter the date from given date or current date by default.
   * @param string type - plus / minus.
   * @param string days - Numbers of days to alter from given date.
   * @param data fromDate - Start date.
   * @return Date - Altered Date.
   */
	alteredDate(type: string = 'plus', days: number = 0, fromDate?: Date) {
		if (!fromDate) {
			fromDate = new Date();
		}
		let dateInt;
		if (type === 'minus') {
			dateInt = fromDate.setDate(fromDate.getDate() - days);
			return new Date(dateInt);
		} else {
			dateInt = fromDate.setDate(fromDate.getDate() + days);
			return new Date(dateInt);
		}
	}

	generate_UUID() {
		let dt = new Date().getTime();
		const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = ((dt + Math.random() * 16) % 16) | 0;
			dt = Math.floor(dt / 16);
			return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
		});
		return uuid;
	}

	checkPopup(urlToOpen: string) {
		let popupWindow: any = window.open(
			urlToOpen,
			'checkpopup',
			'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,width=100,height=100'
		);
		if (popupWindow) {
			try {
				let popupTimer = setTimeout(() => {
					if (popupWindow.closed) {
						clearInterval(popupTimer);
					}
					// popupWindow.close();
				}, 500);
				// console.log('not blocked');
				return false;
			} catch (e) {
				alert('Pop-up Blocker is enabled! Please add this site to your exception list.');
				// console.log('web-outter');
				return true;
			}
		} else {
			alert('Pop-up Blocker is enabled! Please add this site to your exception list.');
			// console.log('out');
			return true;
		}
	}

	async onShare(title: string, url: string = document.location.href, text: string) {
		try {
			return await navigator.share({ title, url, text });
		} catch (err) {
			throw err;
		}
	}
}

