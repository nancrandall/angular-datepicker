import { DateRangeConfig, PageConfigService } from './../../services/page-config.service';
import { Observable } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { templates } from '../../services/template.service';
import 'rxjs/add/operator/map';

class DateRange {
    minDate: Date;
    maxDate: Date;

    constructor() {
        this.minDate = this.maxDate = null;
    }
}

export class DateRangeMonth {
    weeks: any;
    month: number;
    year: number;

    constructor(weeks: any, month: number, year: number) {
        this.weeks = weeks;
        this.month = month;
        this.year = year;
    }
}

@Component({
    selector: 'mcc-date-range-picker',
    template: templates.GetTemplate('daterangepicker.html')
})

// Tips: Date constructor month starts at 0, date is actual date.
//       getDay() returns day of week starting at 0
export class DateRangePickerComponent implements OnInit {

    config: DateRangeConfig;

    minErrorIncorrectFormat: boolean = false;
    minErrorOutOfRange: boolean = false;
    maxErrorIncorrectFormat: boolean = false;
    maxErrorOutOfRange: boolean = false;

    weekdayNames = [ "SU", "MO", "TU", "WE", "TH", "FR", "SA" ];
    monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    @Input() minDate: Date;
    @Input() maxDate: Date;
    @Input() bWasClickedToOpen: boolean;

    selectedDateRange: DateRange;

    @Output() dateRangeApplied = new EventEmitter();
    @Output() dateRangeCancelled = new EventEmitter();

    leftMonth: DateRangeMonth;
    rightMonth: DateRangeMonth;

    minSelectedId: string;
    maxSelectedId: string;

    rangeIds = [];

    constructor(private pageConfigSvc: PageConfigService, private changeDetector: ChangeDetectorRef) {
        
    }

    ngOnInit() {

        this.pageConfigSvc.getDateRangePickerConfig$().subscribe((data: DateRangeConfig) => {
            this.config = data;
        });

        this.selectedDateRange = new DateRange();

        // Initialize Left month
        let leftMonthDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth() - 1, 1);
        this.leftMonth = this.newDateRangeMonth(leftMonthDate);

        // Initialize Right Month
        this.rightMonth = this.newDateRangeMonth(this.maxDate);

        this.minSelectedId = '';
        this.maxSelectedId = '';
    }

    /**
     * Returns the days of the month and their expected class for the month of the date passed as an array of weeks,
     *  in the form: week[week-index][day-index(0-6)] = {date: date, class: 'class'},   starting at sunday of each week in the month.  
     *  Empty strings pad the first and last week for days that do not have a date in the given month
     * @param month  
     */
    getWeeksAndDays(month: Date): any {
        let minDay = this.minDate.getDate();
        let maxDay = this.maxDate.getDate();

        let firstDay: Date = new Date(month.getFullYear(), month.getMonth(), 1);
        let lastDay: Date = new Date(month.getFullYear(), month.getMonth() + 1, 0);

        let weeksAndDays = [];
        let week = 0;
        weeksAndDays[week] = [];
        for (let noDay = 0; noDay < firstDay.getDay(); noDay++) {
            weeksAndDays[week].push('');
        }
        for (let date = 1; date <= this.getDaysInMonth(month); date++) {
            let newDay = new Date(month.getFullYear(), month.getMonth(), date);
            if (date != 1 && newDay.getDay() == 0) {
                week++;
                weeksAndDays[week] = [];
            }

            let _class:string = '';
            if ( newDay < this.minDate || newDay > this.maxDate )
                    _class = 'grey disabled';


            weeksAndDays[week].push({
                date: date,
                class: _class,
                id: this.getDateId(month.getFullYear(), month.getMonth(), date)
            });
        }
        for (let noDay = lastDay.getDay(); noDay < 6; noDay++) {
            weeksAndDays[week].push('');
        }

        return weeksAndDays;
    }

    onDateClick( date: number, month: number, year: number) {

        let selectedDate = new Date(year, month, date);

        // Don't allow clicks if element is disabled
        if (selectedDate < this.minDate || selectedDate > this.maxDate)
            return;
        
        // Set the clicked date as the min and max date if no element has yet been selected, add selected class
        if (this.selectedDateRange.minDate == null && this.selectedDateRange.maxDate == null) {
            this.setMinDate(selectedDate);
            this.setMaxDate(selectedDate);
        }
        else if (this.selectedDateRange.minDate == null && this.selectedDateRange.maxDate != null) {
            if (selectedDate > this.selectedDateRange.maxDate) {
                this.clearDateRange();
            }
            this.setMinDate(selectedDate);
        }
        // Set the clicked date as max date if min has been selected, but the max has not yet been selected, add selected class
        else if (this.selectedDateRange.minDate != null && (this.selectedDateRange.maxDate == null || this.selectedDateRange.maxDate == this.selectedDateRange.minDate)) {
            if (selectedDate > this.selectedDateRange.minDate)
                this.setMaxDate(selectedDate);
            else {
                this.clearDateRange();
                this.setMinDate(selectedDate);
                this.setMaxDate(selectedDate);
            }
        }
        // If range is already selected, clicking a new element will reset the range at the selected element
        else {
            this.clearDateRange();

            this.setMinDate(selectedDate);
            this.setMaxDate(selectedDate);
        }
    }

    monthChangePrevious() {
        let newLeftMonth = new Date(this.leftMonth.year, this.leftMonth.month, 0);
        if (newLeftMonth < this.minDate)
            return;
        else {
            this.rightMonth = this.leftMonth;
            this.leftMonth = this.newDateRangeMonth(newLeftMonth);
        }
    }

    monthChangeNext() {
        let newRightMonth = new Date(this.rightMonth.year, this.rightMonth.month + 1, 1);
        if (newRightMonth > this.maxDate)
            return;
        else {
            this.leftMonth = this.rightMonth;
            this.rightMonth = this.newDateRangeMonth(newRightMonth);
        }
    }

    newDateRangeMonth(month: Date) {
        return new DateRangeMonth(this.getWeeksAndDays(month), month.getMonth(), month.getFullYear());
    }

    mobileMinDateInputFocusOut(event:any) {
        this.minDateInputFocusOut(
            {
                target: {
                    value: event.target.value
                }
            }
        )
    }

    mobileMaxDateInputFocusOut(event:any) {
        this.maxDateInputFocusOut(
            {
                target: {
                    value: event.target.value
                }
            }
        )
    }

    toDesktopDateFormat(date: Date) {
        if (date == null) {
            return "";
        }
        else {
            return (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1).toString() + "/" + (date.getDate() < 10 ? "0" : "") + date.getDate().toString() + "/" + date.getFullYear().toString();
        }
    }

    toMobileDateFormat(date: Date) {
        if (date == null)
            return "";
        return date.getFullYear().toString() + '-' + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1).toString() + '-' + (date.getDate() < 10 ? "0" : "") + date.getDate().toString();
    }

    minDateInputFocusOut(event: any, check?: boolean) {
        this.resetMinErrors();
        if(check == undefined)
            check = false;

        let value = event.target.value;

        if (value == "" || value == null)
        {
            this.setMinDate(null);
            return;
        }

        let date: Date = null;

        if (!isNaN(Date.parse(value)))
            try {
                let dateObj = this.focusOutParseDate(value);
                if(check)
                    date = new Date(value);
                else {
                    date = new Date(dateObj.year, parseInt(dateObj.month)-1 , + dateObj.date);
                }

            } catch(e){
                date = new Date(value);
            }



        if (date == null) {
            this.minErrorIncorrectFormat = true;
            this.setMinDate(null);
        }
        else if (date < this.minDate || date > this.maxDate) {
            this.minErrorOutOfRange = true;
            this.setMinDate(null);
        }
        else {
            if (this.selectedDateRange.maxDate && date >= this.selectedDateRange.maxDate) {
                this.clearDateRange();
                this.setMinDate(date);
                this.setMaxDate(date);
            }
            else {
                this.setMinDate(date);
            }

            this.leftMonth = this.newDateRangeMonth(date);
            this.rightMonth = this.newDateRangeMonth(new Date(date.getFullYear(), date.getMonth() + 1));
        }
    }

    maxDateInputFocusOut(event: any, check?: boolean ) {
        this.resetMaxErrors();

        if(check == undefined)
            check = false;

        let value = event.target.value;
        
        if (value == "" || value == null)
        {
            this.setMaxDate(null);
            return;
        }

        let date: Date = null;

        if (!isNaN(Date.parse(value))) {
            try {
                let dateObj = this.focusOutParseDate(value);
                if(check)
                    date = new Date(value);
                else {
                    date = new Date(dateObj.year, parseInt(dateObj.month)-1, + dateObj.date);
                }
            } catch(e){
                date = new Date(value);
            }
        }

        if (date == null) {
            this.maxErrorIncorrectFormat = true;
            this.setMaxDate(null);
        }
        else if (date < this.minDate || date > this.maxDate) {
            this.maxErrorOutOfRange = true;
            this.setMaxDate(null);
        }
        else {
            if (this.selectedDateRange.minDate && date <= this.selectedDateRange.minDate) {
                this.clearDateRange();
                this.setMaxDate(date);
                this.setMinDate(date);
            }
            else {
                this.setMaxDate(date);
            }

            this.leftMonth = this.newDateRangeMonth(new Date(date.getFullYear(), date.getMonth() - 1));
            this.rightMonth = this.newDateRangeMonth(date);
        }
    }

    focusOutParseDate(value: string) : any {

        let arr: any = [];
        let dayPos: number = -1;
        let monthPos: number = -1;
        let yearPos: number = -1;
        try{
            arr = value.split('-');
            if(arr.length <= 1){
                arr = value.split('/');
                dayPos = 1;
                monthPos = 0;
                yearPos = 2;
            } else {
                yearPos = 0;
                monthPos = 1;
                dayPos = 2;
            }
            let toReturn = {};
            toReturn["year"] = arr[yearPos];
            toReturn["month"] = arr[monthPos];
            toReturn["date"] = arr[dayPos][0] + arr[dayPos][1];

            return toReturn;
        } catch(e){
            console.log("Error trying to split date: " + e);
        }

        return value;
    }

    setMinDate(selectedDate: Date) {
        this.selectedDateRange.minDate = selectedDate;
        if (selectedDate == null) {
            this.minSelectedId = null;
            this.selectedDateRange.minDate = new Date();
            this.changeDetector.detectChanges();
            this.selectedDateRange.minDate = null;
        }
        else {
            this.minSelectedId = this.getDateId(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            this.resetMinErrors();
        }

        this.setInnerDates(this.selectedDateRange.minDate, this.selectedDateRange.maxDate);
    }

    setMaxDate(selectedDate: Date) {
        this.selectedDateRange.maxDate = selectedDate;
        if (selectedDate == null) {
            this.maxSelectedId = null;
            this.selectedDateRange.maxDate = new Date();
            this.changeDetector.detectChanges();
            this.selectedDateRange.maxDate = null;
        }
        else {
            this.maxSelectedId = this.getDateId(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            this.resetMaxErrors();
        }

        this.setInnerDates(this.selectedDateRange.minDate, this.selectedDateRange.maxDate);
    }

    clearDateRange() {
        this.minSelectedId = '';
        this.maxSelectedId = '';
        this.rangeIds = [];

        // Reset the range
        this.selectedDateRange = new DateRange();
    }

    setInnerDates(startingDate: Date, endDate: Date) {
        this.rangeIds = [];

        if (startingDate == null || endDate == null)
            return;

        for (let date = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() + 1); date < endDate; date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) {
            this.rangeIds.push(this.getDateId(date.getFullYear(), date.getMonth(), date.getDate()));
        }
    }

    /**
     * Returns the number of days in the month of the date passed
     * @param month 
     */
    getDaysInMonth(month: Date) {
        return new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    };

    /**
     * Emits the chosen dates when user applies the selected date range
     */
    applyDateRange() {
        this.dateRangeApplied.emit({ minSelectedDate: this.selectedDateRange.minDate, maxSelectedDate: this.selectedDateRange.maxDate });
    }

    cancelDateRange() {
        this.dateRangeCancelled.emit(true);
    }

    getDateId(year: number, month: number, date: number) {
        return "date-range-" + year + '-' + month + '-' + date;
    }

    resetMinErrors() {
        this.minErrorIncorrectFormat = false;
        this.minErrorOutOfRange = false;
    }

    resetMaxErrors() {
        this.maxErrorIncorrectFormat = false;
        this.maxErrorOutOfRange = false;
    }
}
