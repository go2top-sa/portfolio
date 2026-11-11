const X=require('xlsx'),fs=require('fs');fs.mkdirSync(__dirname+'/cases',{recursive:true});
const w=(n,sheets)=>{const wb=X.utils.book_new();for(const[s,a]of sheets)X.utils.book_append_sheet(wb,X.utils.aoa_to_sheet(a,{cellDates:true}),s);X.writeFile(wb,__dirname+'/cases/'+n)};
const depts=['HR','IT','Finance','Sales','Ops'],cities=['Riyadh','Jeddah','Dammam','Remote','Abha'];
let r=1;const R=()=>{r=(r*16807)%2147483647;return r/2147483647};const P=a=>a[Math.floor(R()*a.length)];
// 1 english
w('01_english.xlsx',[['Employees',[['Employee ID','Full Name','Department','Gender','Nationality','Hire Date','Exit Date','Status','Gross Salary','Performance','City','Attendance'],...Array.from({length:60},(_,i)=>[i+1,'Emp '+i,P(depts),P(['M','F','Male','Female']),P(['Saudi','KSA','Indian','Egyptian']),new Date(2015+Math.floor(R()*11),Math.floor(R()*12),5),R()<.15?new Date(2026,Math.floor(R()*9),3):null,P(['Active','Active','Probation','']),Math.round(5000+R()*20000),Math.round((1+R()*4)*10)/10,P(cities),Math.round((0.8+R()*0.2)*100)/100])]]]);
// 2 minimal
w('02_minimal.xlsx',[['s',[['الاسم','الإدارة'],['أ','المالية'],['ب','المالية'],['ج','التقنية']]]]);
// 3 title rows
w('03_titlerows.xlsx',[['Sheet1',[['تقرير الموظفين 2026'],[],['شركة س'],['الرقم','الاسم','القسم','الجنس','الجنسية','تاريخ التعيين','الراتب'],...Array.from({length:30},(_,i)=>[i,'م'+i,P(['أ','ب','ج']),P(['ذكر','أنثى']),P(['سعودي','مصري']),'2021-0'+(1+i%9)+'-1'+(i%9),9000+i*100]),['','الإجمالي','','','','',999999]]]]);
// 4 hijri
w('04_hijri.xlsx',[['s',[['الاسم','الإدارة','الجنسية','تاريخ التعيين','الراتب'],...Array.from({length:20},(_,i)=>['م'+i,'أ','سعودي','14'+(40+i%6)+'/0'+(1+i%9)+'/15',10000])]]]);
// 5 all terminated
w('05_allexit.xlsx',[['s',[['الاسم','الإدارة','تاريخ التعيين','تاريخ الانتهاء','الحالة','الراتب'],...Array.from({length:10},(_,i)=>['م'+i,'أ',new Date(2018,1,1),new Date(2024,1,1),'منتهي',8000])]]]);
// 6 single
w('06_single.xlsx',[['s',[['الاسم','الإدارة','الجنس','الجنسية','الراتب','التقييم'],['وحيد','الإدارة','ذكر','سعودي',12000,88]]]]);
// 7 big
w('07_big.xlsx',[['s',[['الرقم الوظيفي','الاسم','الإدارة','الجنس','الجنسية','تاريخ التعيين','الحالة','الراتب','التقييم','المدينة','نسبة الحضور'],...Array.from({length:5000},(_,i)=>[i,'موظف '+i,'إدارة '+(i%40),P(['ذكر','أنثى']),P(['سعودي','هندي']),new Date(2010+Math.floor(R()*16),Math.floor(R()*12),1),'',Math.round(4000+R()*40000),Math.round(50+R()*50),P(['الرياض','جدة','بريدة','تبوك']),Math.round(70+R()*30)])]]]);
// 8 weird values
w('08_weird.xlsx',[['s',[['الاسم ','  الإدارة','الجنس','الجنسية','تاريخ التعيين','الراتب','التقييم','نسبة الحضور','الحالة'],
 ['أ','المبيعات','M','KSA','12/25/2020','١٢٬٠٠٠ ريال','85%','95%','Active'],
 ['ب','المبيعات','f','saudi arabian','2020-01-15 00:00:00','SAR 9,500','4.5','0.9','Resigned'],
 ['ج','المبيعات ','ذكر','سعودي الجنسية','غير معروف','-','ممتاز','N/A','on leave'],
 ['د','sales','انثى','Saudi','2031-01-01','15000.50',120,150,''],
 ['هـ','Sales','other','','',0,0,0,'Terminated']]]]);
// 9 headers only
w('09_headers_only.xlsx',[['s',[['الاسم','الإدارة','الراتب']]]]);
// 10 unknown headers
w('10_unknown_headers.xlsx',[['s',[['Name of Employee','Dept. Name','Basic Salary','Join Dt','Sex','Nation'],...Array.from({length:10},(_,i)=>['e'+i,'IT',7000,'2020-02-02','M','Saudi'])]]]);
// 11 csv bom
fs.writeFileSync('cases/11_bom.csv','﻿الاسم,الإدارة,الجنس,الجنسية,تاريخ التعيين,الراتب\nأ,المالية,ذكر,سعودي,15/03/2021,9000\nب,التقنية,أنثى,هندي,03/15/2022,"12,000"\n');
// 12 empty workbook
w('12_empty.xlsx',[['s',[[]]]]);
// 13 long names, many depts
w('13_longnames.xlsx',[['s',[['الاسم','الإدارة','الراتب','التقييم','المدينة'],...Array.from({length:25},(_,i)=>['عبدالرحمن بن عبدالعزيز بن محمد بن عبدالله آل '+i,'إدارة الشؤون المالية والإدارية والخدمات المساندة رقم '+i,1000*(i+1),60+i,'الرياض'])]]]);
// 14 attendance sheet with english months, decimals
w('14_attsheet.xlsx',[['Staff',[['Name','Department','Nationality'],['a','HR','Saudi'],['b','IT','Indian']]],['Attendance',[['Department','Jan','Feb','Mar'],['HR',0.95,0.97,null],['IT','88%','90%',91],['',null,null,null]]]]);
// 15 salary negative / exponent, duplicate ids different names
w('15_dupids.xlsx',[['s',[['الرقم الوظيفي','الاسم','الإدارة','الراتب'],[1,'أ','س',5000],[1,'ب','س',6000],[2,'ج','س',-300],[3,'د','ص','1e4']]]]);
// 19 wage rules for Nitaqat: Saudi < 3000 excluded, 3000-3999 counts half
w('19_wages.xlsx',[['s',[['الرقم الوظيفي','الاسم','الإدارة','الجنسية','الراتب'],[1,'أ','المبيعات','سعودي',2500],[2,'ب','المبيعات','سعودي',3500],[3,'ج','المبيعات','سعودي',3800],[4,'د','المبيعات','سعودي',6000],[5,'هـ','المبيعات','سعودي',9000],[6,'و','المخازن','هندي',4000],[7,'ز','المخازن','هندي',4000],[8,'ح','المخازن','مصري',4000],[9,'ط','المخازن','مصري',4000],[10,'ي','المخازن','باكستاني',4000]]]]]);
