import { Observable } from 'rxjs';
import { PageConfigService, DateRangeConfig } from './../../services/page-config.service';
import { Component } from '@angular/core';
import { DateRangePickerComponent, DateRangeMonth } from './date-range-picker.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

class MockPageConfigSvc {
    getDateRangePickerConfig$ = () => {return Observable.of(
        new DateRangeConfig(
            "from", 
            "to", 
            "cancel", 
            "apply", 
            "format err", 
            "out range err",
            [
                "Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug", 
                "Sep", "Oct", "Nov", "Dec"
            ],
            [
                "SU", "MO", "TU", "WE", "TH", "FR", "SA"
            ] 
        )
    )}
}

describe('Date Range Picker', () => {
    let component: DateRangePickerComponent;
    let fixture: ComponentFixture<DateRangePickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DateRangePickerComponent
            ],
            providers: [
                { provide: PageConfigService, useClass: MockPageConfigSvc }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(DateRangePickerComponent);
        component = fixture.componentInstance;

        component.minDate = new Date(2017, 0, 1);
        component.maxDate = new Date(2017, 11, 1);
        component.bWasClickedToOpen = true;

        fixture.detectChanges();
    }));

    it('should create', async(() => {
        expect(component).toBeTruthy();
    }));


    describe('getWeeksAndDays()', () => {
        it('should return the days of the month, sorted into weeks as a 2D array, padded in front and back with empty strings to represent the days in the first and last week that aren\'t in the month ', () => {
            expect(component.getWeeksAndDays(new Date(2017, 0, 1))).toEqual( [ 
                [ 
                    { date: 1, class: '', id: 'date-range-2017-0-1' },  
                    { date: 2, class: '', id: 'date-range-2017-0-2' },  
                    { date: 3, class: '', id: 'date-range-2017-0-3' },  
                    { date: 4, class: '', id: 'date-range-2017-0-4' },  
                    { date: 5, class: '', id: 'date-range-2017-0-5' },  
                    { date: 6, class: '', id: 'date-range-2017-0-6' },  
                    { date: 7, class: '', id: 'date-range-2017-0-7' } 
                ], 
                [  
                    { date: 8, class: '', id: 'date-range-2017-0-8' },  
                    { date: 9, class: '', id: 'date-range-2017-0-9' },  
                    { date: 10, class: '', id: 'date-range-2017-0-10' },  
                    { date: 11, class: '', id: 'date-range-2017-0-11' },  
                    { date: 12, class: '', id: 'date-range-2017-0-12' },  
                    { date: 13, class: '', id: 'date-range-2017-0-13' },  
                    { date: 14, class: '', id: 'date-range-2017-0-14' } 
                ], 
                [  
                    { date: 15, class: '', id: 'date-range-2017-0-15' },  
                    { date: 16, class: '', id: 'date-range-2017-0-16' }, 
                    { date: 17, class: '', id: 'date-range-2017-0-17' },  
                    { date: 18, class: '', id: 'date-range-2017-0-18' },  
                    { date: 19, class: '', id: 'date-range-2017-0-19' },  
                    { date: 20, class: '', id: 'date-range-2017-0-20' },  
                    { date: 21, class: '', id: 'date-range-2017-0-21' } 
                ], 
                [  
                    { date: 22, class: '', id: 'date-range-2017-0-22' },  
                    { date: 23, class: '', id: 'date-range-2017-0-23' },  
                    { date: 24, class: '', id: 'date-range-2017-0-24' },  
                    { date: 25, class: '', id: 'date-range-2017-0-25' },  
                    { date: 26, class: '', id: 'date-range-2017-0-26' },  
                    { date: 27, class: '', id: 'date-range-2017-0-27' },  
                    { date: 28, class: '', id: 'date-range-2017-0-28' } 
                ], 
                [  
                    { date: 29, class: '', id: 'date-range-2017-0-29' },  
                    { date: 30, class: '', id: 'date-range-2017-0-30' },  
                    { date: 31, class: '', id: 'date-range-2017-0-31' }, 
                    '', 
                    '', 
                    '', 
                    '' 
                ] 
            ]);
        });
    });

    describe('onDateClick()', () => {
        it('nothing should happen if date passed is less than min date', () => {
            component.onDateClick(4, 4, 1994);
            expect(component.minSelectedId).toEqual('');
            expect(component.maxSelectedId).toEqual('');
        })

        it('min select date should be set when valid date is \'clicked\'', () => {
            component.onDateClick(4, 4, 2017);
            expect(component.minSelectedId).toEqual('date-range-2017-4-4');
            expect(component.maxSelectedId).toEqual('date-range-2017-4-4');
        })

        it('min then max select date should be set when valid date is \'clicked\', then a greater valid date is clicked', () => {
            component.onDateClick(4, 4, 2017);
            expect(component.minSelectedId).toEqual('date-range-2017-4-4');
            expect(component.maxSelectedId).toEqual('date-range-2017-4-4');

            component.onDateClick(5, 5, 2017);
            expect(component.minSelectedId).toEqual('date-range-2017-4-4');
            expect(component.maxSelectedId).toEqual('date-range-2017-5-5');
        })

        it('min select date should be set when valid date is \'clicked\', then should reset if valid lesser date is clicked', () => {
            component.onDateClick(4, 4, 2017);
            expect(component.minSelectedId).toEqual('date-range-2017-4-4');
            expect(component.maxSelectedId).toEqual('date-range-2017-4-4');

            component.onDateClick(3, 3, 2017);
            expect(component.minSelectedId).toEqual('date-range-2017-3-3');
            expect(component.maxSelectedId).toEqual('date-range-2017-3-3');
        })
    })

    describe('monthChangePrevious()', () => {
        it('leftMonth should be set to the previous month if it\'s within range', () => {
            component.monthChangePrevious();
            expect(component.leftMonth).toEqual(
                new DateRangeMonth(
                    [ 
                        [ 
                            { date: 1, class: '', id: 'date-range-2017-9-1' },  
                            { date: 2, class: '', id: 'date-range-2017-9-2' },  
                            { date: 3, class: '', id: 'date-range-2017-9-3' },  
                            { date: 4, class: '', id: 'date-range-2017-9-4' },  
                            { date: 5, class: '', id: 'date-range-2017-9-5' },  
                            { date: 6, class: '', id: 'date-range-2017-9-6' },  
                            { date: 7, class: '', id: 'date-range-2017-9-7' } 
                        ], 
                        [  
                            { date: 8, class: '', id: 'date-range-2017-9-8' },  
                            { date: 9, class: '', id: 'date-range-2017-9-9' },  
                            { date: 10, class: '', id: 'date-range-2017-9-10' },  
                            { date: 11, class: '', id: 'date-range-2017-9-11' },  
                            { date: 12, class: '', id: 'date-range-2017-9-12' },  
                            { date: 13, class: '', id: 'date-range-2017-9-13' },  
                            { date: 14, class: '', id: 'date-range-2017-9-14' } 
                        ], 
                        [  
                            { date: 15, class: '', id: 'date-range-2017-9-15' },  
                            { date: 16, class: '', id: 'date-range-2017-9-16' }, 
                            { date: 17, class: '', id: 'date-range-2017-9-17' },  
                            { date: 18, class: '', id: 'date-range-2017-9-18' },  
                            { date: 19, class: '', id: 'date-range-2017-9-19' },  
                            { date: 20, class: '', id: 'date-range-2017-9-20' },  
                            { date: 21, class: '', id: 'date-range-2017-9-21' } 
                        ], 
                        [  
                            { date: 22, class: '', id: 'date-range-2017-9-22' },  
                            { date: 23, class: '', id: 'date-range-2017-9-23' },  
                            { date: 24, class: '', id: 'date-range-2017-9-24' },  
                            { date: 25, class: '', id: 'date-range-2017-9-25' },  
                            { date: 26, class: '', id: 'date-range-2017-9-26' },  
                            { date: 27, class: '', id: 'date-range-2017-9-27' },  
                            { date: 28, class: '', id: 'date-range-2017-9-28' } 
                        ], 
                        [  
                            { date: 29, class: '', id: 'date-range-2017-9-29' },  
                            { date: 30, class: '', id: 'date-range-2017-9-30' },  
                            { date: 31, class: '', id: 'date-range-2017-9-31' }, 
                            '', 
                            '', 
                            '', 
                            '' 
                        ] 
                    ],
                    9,
                    2017
                )
            );
            
            expect(component.rightMonth).toEqual(
                new DateRangeMonth(
                    [ 
                        [ 
                            '',
                            '',
                            '',
                            { date: 1, class: '', id: 'date-range-2017-10-1' },  
                            { date: 2, class: '', id: 'date-range-2017-10-2' },  
                            { date: 3, class: '', id: 'date-range-2017-10-3' },  
                            { date: 4, class: '', id: 'date-range-2017-10-4' }  
                        ], 
                        [  
                            { date: 5, class: '', id: 'date-range-2017-10-5' },  
                            { date: 6, class: '', id: 'date-range-2017-10-6' },  
                            { date: 7, class: '', id: 'date-range-2017-10-7' }, 
                            { date: 8, class: '', id: 'date-range-2017-10-8' },  
                            { date: 9, class: '', id: 'date-range-2017-10-9' },  
                            { date: 10, class: '', id: 'date-range-2017-10-10' },  
                            { date: 11, class: '', id: 'date-range-2017-10-11' }
                        ], 
                        [
                            { date: 12, class: '', id: 'date-range-2017-10-12' },  
                            { date: 13, class: '', id: 'date-range-2017-10-13' },  
                            { date: 14, class: '', id: 'date-range-2017-10-14' },   
                            { date: 15, class: '', id: 'date-range-2017-10-15' },  
                            { date: 16, class: '', id: 'date-range-2017-10-16' }, 
                            { date: 17, class: '', id: 'date-range-2017-10-17' },  
                            { date: 18, class: '', id: 'date-range-2017-10-18' }
                        ], 
                        [  
                            { date: 19, class: '', id: 'date-range-2017-10-19' },  
                            { date: 20, class: '', id: 'date-range-2017-10-20' },  
                            { date: 21, class: '', id: 'date-range-2017-10-21' }, 
                            { date: 22, class: '', id: 'date-range-2017-10-22' },  
                            { date: 23, class: '', id: 'date-range-2017-10-23' },  
                            { date: 24, class: '', id: 'date-range-2017-10-24' },  
                            { date: 25, class: '', id: 'date-range-2017-10-25' },  
                        ], 
                        [  
                            { date: 26, class: '', id: 'date-range-2017-10-26' },  
                            { date: 27, class: '', id: 'date-range-2017-10-27' },  
                            { date: 28, class: '', id: 'date-range-2017-10-28' }, 
                            { date: 29, class: '', id: 'date-range-2017-10-29' },  
                            { date: 30, class: '', id: 'date-range-2017-10-30' },  
                            '', 
                            ''
                        ] 
                    ],
                    10,
                    2017
                )
            ); 
        })
    })

    describe('monthChangeNext()', () => {
        it('rightMonth should be set to the next month if it\'s within range', () => {
            component.monthChangePrevious();
            component.monthChangeNext();
            expect(component.leftMonth).toEqual(
                new DateRangeMonth(
                    [ 
                        [ 
                            '',
                            '',
                            '',
                            { date: 1, class: '', id: 'date-range-2017-10-1' },  
                            { date: 2, class: '', id: 'date-range-2017-10-2' },  
                            { date: 3, class: '', id: 'date-range-2017-10-3' },  
                            { date: 4, class: '', id: 'date-range-2017-10-4' }  
                        ], 
                        [  
                            { date: 5, class: '', id: 'date-range-2017-10-5' },  
                            { date: 6, class: '', id: 'date-range-2017-10-6' },  
                            { date: 7, class: '', id: 'date-range-2017-10-7' }, 
                            { date: 8, class: '', id: 'date-range-2017-10-8' },  
                            { date: 9, class: '', id: 'date-range-2017-10-9' },  
                            { date: 10, class: '', id: 'date-range-2017-10-10' },  
                            { date: 11, class: '', id: 'date-range-2017-10-11' }
                        ], 
                        [
                            { date: 12, class: '', id: 'date-range-2017-10-12' },  
                            { date: 13, class: '', id: 'date-range-2017-10-13' },  
                            { date: 14, class: '', id: 'date-range-2017-10-14' },   
                            { date: 15, class: '', id: 'date-range-2017-10-15' },  
                            { date: 16, class: '', id: 'date-range-2017-10-16' }, 
                            { date: 17, class: '', id: 'date-range-2017-10-17' },  
                            { date: 18, class: '', id: 'date-range-2017-10-18' }
                        ], 
                        [  
                            { date: 19, class: '', id: 'date-range-2017-10-19' },  
                            { date: 20, class: '', id: 'date-range-2017-10-20' },  
                            { date: 21, class: '', id: 'date-range-2017-10-21' }, 
                            { date: 22, class: '', id: 'date-range-2017-10-22' },  
                            { date: 23, class: '', id: 'date-range-2017-10-23' },  
                            { date: 24, class: '', id: 'date-range-2017-10-24' },  
                            { date: 25, class: '', id: 'date-range-2017-10-25' },  
                        ], 
                        [  
                            { date: 26, class: '', id: 'date-range-2017-10-26' },  
                            { date: 27, class: '', id: 'date-range-2017-10-27' },  
                            { date: 28, class: '', id: 'date-range-2017-10-28' }, 
                            { date: 29, class: '', id: 'date-range-2017-10-29' },  
                            { date: 30, class: '', id: 'date-range-2017-10-30' },  
                            '', 
                            ''
                        ] 
                    ],
                    10,
                    2017
                )
            ); 

            expect(component.rightMonth).toEqual(
                new DateRangeMonth(
                    [ 
                        [ 
                            '',
                            '',
                            '',
                            '',
                            '',
                            { date: 1, class: '', id: 'date-range-2017-11-1' },  
                            { date: 2, class: 'grey disabled', id: 'date-range-2017-11-2' }
                        ], 
                        [  
                            { date: 3, class: 'grey disabled', id: 'date-range-2017-11-3' },  
                            { date: 4, class: 'grey disabled', id: 'date-range-2017-11-4' },  
                            { date: 5, class: 'grey disabled', id: 'date-range-2017-11-5' },  
                            { date: 6, class: 'grey disabled', id: 'date-range-2017-11-6' },  
                            { date: 7, class: 'grey disabled', id: 'date-range-2017-11-7' }, 
                            { date: 8, class: 'grey disabled', id: 'date-range-2017-11-8' },  
                            { date: 9, class: 'grey disabled', id: 'date-range-2017-11-9' }
                        ], 
                        [
                            { date: 10, class: 'grey disabled', id: 'date-range-2017-11-10' },  
                            { date: 11, class: 'grey disabled', id: 'date-range-2017-11-11' },
                            { date: 12, class: 'grey disabled', id: 'date-range-2017-11-12' },  
                            { date: 13, class: 'grey disabled', id: 'date-range-2017-11-13' },  
                            { date: 14, class: 'grey disabled', id: 'date-range-2017-11-14' },   
                            { date: 15, class: 'grey disabled', id: 'date-range-2017-11-15' },  
                            { date: 16, class: 'grey disabled', id: 'date-range-2017-11-16' }
                        ], 
                        [  
                            { date: 17, class: 'grey disabled', id: 'date-range-2017-11-17' },  
                            { date: 18, class: 'grey disabled', id: 'date-range-2017-11-18' },
                            { date: 19, class: 'grey disabled', id: 'date-range-2017-11-19' },  
                            { date: 20, class: 'grey disabled', id: 'date-range-2017-11-20' },  
                            { date: 21, class: 'grey disabled', id: 'date-range-2017-11-21' }, 
                            { date: 22, class: 'grey disabled', id: 'date-range-2017-11-22' },  
                            { date: 23, class: 'grey disabled', id: 'date-range-2017-11-23' }
                        ], 
                        [  
                            { date: 24, class: 'grey disabled', id: 'date-range-2017-11-24' },  
                            { date: 25, class: 'grey disabled', id: 'date-range-2017-11-25' },  
                            { date: 26, class: 'grey disabled', id: 'date-range-2017-11-26' },  
                            { date: 27, class: 'grey disabled', id: 'date-range-2017-11-27' },  
                            { date: 28, class: 'grey disabled', id: 'date-range-2017-11-28' }, 
                            { date: 29, class: 'grey disabled', id: 'date-range-2017-11-29' },  
                            { date: 30, class: 'grey disabled', id: 'date-range-2017-11-30' }
                        ],
                        [
                            { date: 31, class: 'grey disabled', id: 'date-range-2017-11-31' },
                            '',
                            '',
                            '',
                            '',
                            '',
                            ''
                        ] 
                    ],
                    11,
                    2017
                )
            ); 
        })
    })

    describe('minDateInputFocusOut()', ()=> {
        it('should set min error if date cannot be formatted', () => {
            component.minDateInputFocusOut({target: {value: 'blue'}}, true);
            expect(component.minErrorIncorrectFormat).toEqual(true);
        })

        it('should set min error if date is out of range', () => {
            component.minDateInputFocusOut({target: {value: '1/1/1994'}}, true);
            expect(component.minErrorOutOfRange).toEqual(true);
        })

        it('should set left month to the month entered, right month to month after left, and set minSelectedId to match the date entered', () => {
            component.minDateInputFocusOut({target: {value: '10/1/2017'}}, true)

            expect(component.leftMonth).toEqual(
                new DateRangeMonth(
                    [ 
                        [ 
                            { date: 1, class: '', id: 'date-range-2017-9-1' },  
                            { date: 2, class: '', id: 'date-range-2017-9-2' },  
                            { date: 3, class: '', id: 'date-range-2017-9-3' },  
                            { date: 4, class: '', id: 'date-range-2017-9-4' },  
                            { date: 5, class: '', id: 'date-range-2017-9-5' },  
                            { date: 6, class: '', id: 'date-range-2017-9-6' },  
                            { date: 7, class: '', id: 'date-range-2017-9-7' } 
                        ], 
                        [  
                            { date: 8, class: '', id: 'date-range-2017-9-8' },  
                            { date: 9, class: '', id: 'date-range-2017-9-9' },  
                            { date: 10, class: '', id: 'date-range-2017-9-10' },  
                            { date: 11, class: '', id: 'date-range-2017-9-11' },  
                            { date: 12, class: '', id: 'date-range-2017-9-12' },  
                            { date: 13, class: '', id: 'date-range-2017-9-13' },  
                            { date: 14, class: '', id: 'date-range-2017-9-14' } 
                        ], 
                        [  
                            { date: 15, class: '', id: 'date-range-2017-9-15' },  
                            { date: 16, class: '', id: 'date-range-2017-9-16' }, 
                            { date: 17, class: '', id: 'date-range-2017-9-17' },  
                            { date: 18, class: '', id: 'date-range-2017-9-18' },  
                            { date: 19, class: '', id: 'date-range-2017-9-19' },  
                            { date: 20, class: '', id: 'date-range-2017-9-20' },  
                            { date: 21, class: '', id: 'date-range-2017-9-21' } 
                        ], 
                        [  
                            { date: 22, class: '', id: 'date-range-2017-9-22' },  
                            { date: 23, class: '', id: 'date-range-2017-9-23' },  
                            { date: 24, class: '', id: 'date-range-2017-9-24' },  
                            { date: 25, class: '', id: 'date-range-2017-9-25' },  
                            { date: 26, class: '', id: 'date-range-2017-9-26' },  
                            { date: 27, class: '', id: 'date-range-2017-9-27' },  
                            { date: 28, class: '', id: 'date-range-2017-9-28' } 
                        ], 
                        [  
                            { date: 29, class: '', id: 'date-range-2017-9-29' },  
                            { date: 30, class: '', id: 'date-range-2017-9-30' },  
                            { date: 31, class: '', id: 'date-range-2017-9-31' }, 
                            '', 
                            '', 
                            '', 
                            '' 
                        ] 
                    ],
                    9,
                    2017
                )
            );
            expect(component.minSelectedId).toEqual('date-range-2017-9-1');
            
            expect(component.rightMonth).toEqual(
                new DateRangeMonth(
                    [ 
                        [ 
                            '',
                            '',
                            '',
                            { date: 1, class: '', id: 'date-range-2017-10-1' },  
                            { date: 2, class: '', id: 'date-range-2017-10-2' },  
                            { date: 3, class: '', id: 'date-range-2017-10-3' },  
                            { date: 4, class: '', id: 'date-range-2017-10-4' }  
                        ], 
                        [  
                            { date: 5, class: '', id: 'date-range-2017-10-5' },  
                            { date: 6, class: '', id: 'date-range-2017-10-6' },  
                            { date: 7, class: '', id: 'date-range-2017-10-7' }, 
                            { date: 8, class: '', id: 'date-range-2017-10-8' },  
                            { date: 9, class: '', id: 'date-range-2017-10-9' },  
                            { date: 10, class: '', id: 'date-range-2017-10-10' },  
                            { date: 11, class: '', id: 'date-range-2017-10-11' }
                        ], 
                        [
                            { date: 12, class: '', id: 'date-range-2017-10-12' },  
                            { date: 13, class: '', id: 'date-range-2017-10-13' },  
                            { date: 14, class: '', id: 'date-range-2017-10-14' },   
                            { date: 15, class: '', id: 'date-range-2017-10-15' },  
                            { date: 16, class: '', id: 'date-range-2017-10-16' }, 
                            { date: 17, class: '', id: 'date-range-2017-10-17' },  
                            { date: 18, class: '', id: 'date-range-2017-10-18' }
                        ], 
                        [  
                            { date: 19, class: '', id: 'date-range-2017-10-19' },  
                            { date: 20, class: '', id: 'date-range-2017-10-20' },  
                            { date: 21, class: '', id: 'date-range-2017-10-21' }, 
                            { date: 22, class: '', id: 'date-range-2017-10-22' },  
                            { date: 23, class: '', id: 'date-range-2017-10-23' },  
                            { date: 24, class: '', id: 'date-range-2017-10-24' },  
                            { date: 25, class: '', id: 'date-range-2017-10-25' },  
                        ], 
                        [  
                            { date: 26, class: '', id: 'date-range-2017-10-26' },  
                            { date: 27, class: '', id: 'date-range-2017-10-27' },  
                            { date: 28, class: '', id: 'date-range-2017-10-28' }, 
                            { date: 29, class: '', id: 'date-range-2017-10-29' },  
                            { date: 30, class: '', id: 'date-range-2017-10-30' },  
                            '', 
                            ''
                        ] 
                    ],
                    10,
                    2017
                )
            ); 
        })
    })

    describe('maxDateInputFocusOut()', ()=> {
        it('should set max error if date cannot be formatted', () => {
            component.maxDateInputFocusOut({target: {value: 'blue'}}, true);
            expect(component.maxErrorIncorrectFormat).toEqual(true);
        })

        it('should set min error if date is out of range', () => {
            component.maxDateInputFocusOut({target: {value: '1/1/2082'}}, true);
            expect(component.maxErrorOutOfRange).toEqual(true);
        })

        it('should set right month to the month entered, left month to month before right, and set maxSelectedId match the date entered', () => {
            component.maxDateInputFocusOut({target: {value: '11/1/2017'}}, true)

            expect(component.leftMonth).toEqual(
                new DateRangeMonth(
                    [ 
                        [ 
                            { date: 1, class: '', id: 'date-range-2017-9-1' },  
                            { date: 2, class: '', id: 'date-range-2017-9-2' },  
                            { date: 3, class: '', id: 'date-range-2017-9-3' },  
                            { date: 4, class: '', id: 'date-range-2017-9-4' },  
                            { date: 5, class: '', id: 'date-range-2017-9-5' },  
                            { date: 6, class: '', id: 'date-range-2017-9-6' },  
                            { date: 7, class: '', id: 'date-range-2017-9-7' } 
                        ], 
                        [  
                            { date: 8, class: '', id: 'date-range-2017-9-8' },  
                            { date: 9, class: '', id: 'date-range-2017-9-9' },  
                            { date: 10, class: '', id: 'date-range-2017-9-10' },  
                            { date: 11, class: '', id: 'date-range-2017-9-11' },  
                            { date: 12, class: '', id: 'date-range-2017-9-12' },  
                            { date: 13, class: '', id: 'date-range-2017-9-13' },  
                            { date: 14, class: '', id: 'date-range-2017-9-14' } 
                        ], 
                        [  
                            { date: 15, class: '', id: 'date-range-2017-9-15' },  
                            { date: 16, class: '', id: 'date-range-2017-9-16' }, 
                            { date: 17, class: '', id: 'date-range-2017-9-17' },  
                            { date: 18, class: '', id: 'date-range-2017-9-18' },  
                            { date: 19, class: '', id: 'date-range-2017-9-19' },  
                            { date: 20, class: '', id: 'date-range-2017-9-20' },  
                            { date: 21, class: '', id: 'date-range-2017-9-21' } 
                        ], 
                        [  
                            { date: 22, class: '', id: 'date-range-2017-9-22' },  
                            { date: 23, class: '', id: 'date-range-2017-9-23' },  
                            { date: 24, class: '', id: 'date-range-2017-9-24' },  
                            { date: 25, class: '', id: 'date-range-2017-9-25' },  
                            { date: 26, class: '', id: 'date-range-2017-9-26' },  
                            { date: 27, class: '', id: 'date-range-2017-9-27' },  
                            { date: 28, class: '', id: 'date-range-2017-9-28' } 
                        ], 
                        [  
                            { date: 29, class: '', id: 'date-range-2017-9-29' },  
                            { date: 30, class: '', id: 'date-range-2017-9-30' },  
                            { date: 31, class: '', id: 'date-range-2017-9-31' }, 
                            '', 
                            '', 
                            '', 
                            '' 
                        ] 
                    ],
                    9,
                    2017
                )
            );
            
            expect(component.rightMonth).toEqual(
                new DateRangeMonth(
                    [ 
                        [ 
                            '',
                            '',
                            '',
                            { date: 1, class: '', id: 'date-range-2017-10-1' },  
                            { date: 2, class: '', id: 'date-range-2017-10-2' },  
                            { date: 3, class: '', id: 'date-range-2017-10-3' },  
                            { date: 4, class: '', id: 'date-range-2017-10-4' }  
                        ], 
                        [  
                            { date: 5, class: '', id: 'date-range-2017-10-5' },  
                            { date: 6, class: '', id: 'date-range-2017-10-6' },  
                            { date: 7, class: '', id: 'date-range-2017-10-7' }, 
                            { date: 8, class: '', id: 'date-range-2017-10-8' },  
                            { date: 9, class: '', id: 'date-range-2017-10-9' },  
                            { date: 10, class: '', id: 'date-range-2017-10-10' },  
                            { date: 11, class: '', id: 'date-range-2017-10-11' }
                        ], 
                        [
                            { date: 12, class: '', id: 'date-range-2017-10-12' },  
                            { date: 13, class: '', id: 'date-range-2017-10-13' },  
                            { date: 14, class: '', id: 'date-range-2017-10-14' },   
                            { date: 15, class: '', id: 'date-range-2017-10-15' },  
                            { date: 16, class: '', id: 'date-range-2017-10-16' }, 
                            { date: 17, class: '', id: 'date-range-2017-10-17' },  
                            { date: 18, class: '', id: 'date-range-2017-10-18' }
                        ], 
                        [  
                            { date: 19, class: '', id: 'date-range-2017-10-19' },  
                            { date: 20, class: '', id: 'date-range-2017-10-20' },  
                            { date: 21, class: '', id: 'date-range-2017-10-21' }, 
                            { date: 22, class: '', id: 'date-range-2017-10-22' },  
                            { date: 23, class: '', id: 'date-range-2017-10-23' },  
                            { date: 24, class: '', id: 'date-range-2017-10-24' },  
                            { date: 25, class: '', id: 'date-range-2017-10-25' },  
                        ], 
                        [  
                            { date: 26, class: '', id: 'date-range-2017-10-26' },  
                            { date: 27, class: '', id: 'date-range-2017-10-27' },  
                            { date: 28, class: '', id: 'date-range-2017-10-28' }, 
                            { date: 29, class: '', id: 'date-range-2017-10-29' },  
                            { date: 30, class: '', id: 'date-range-2017-10-30' },  
                            '', 
                            ''
                        ] 
                    ],
                    10,
                    2017
                )
            ); 

            expect(component.maxSelectedId).toEqual('date-range-2017-10-1');
        })
    })
})
