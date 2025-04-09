package model

import "fmt"

type DayOpeningHours struct {
	Open  string `json:"open"`
	Close string `json:"close"`
} 

func (d *DayOpeningHours) ToString() string {
	return fmt.Sprintf("Open: %s, Close: %s", d.Open, d.Close)
}

type OpeningHours struct {
	Monday	DayOpeningHours `json:"monday"`
	Tuesday	DayOpeningHours `json:"tuesday"`
	Wednesday	DayOpeningHours `json:"wednesday"`
	Thursday	DayOpeningHours `json:"thursday"`
	Friday	DayOpeningHours `json:"friday"`
	Saturday	DayOpeningHours `json:"saturday"`
	Sunday	DayOpeningHours `json:"sunday"`
}

func (o *OpeningHours) ToString() string{
	return fmt.Sprintf("{Monday: {%s}, Tuesday: { %s}, Wednesday: { %s}, Thursday: { %s}, Friday: { %s}, Saturday: { %s}, Sunday: { %s}}",
		o.Monday.ToString(),
		o.Tuesday.ToString(),
		o.Wednesday.ToString(),
		o.Thursday.ToString(),
		o.Friday.ToString(),
		o.Saturday.ToString(),
		o.Sunday.ToString())
}
