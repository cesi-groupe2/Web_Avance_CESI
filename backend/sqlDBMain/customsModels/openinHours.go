package customsmodels

import "fmt"

type Interval struct {
	Start string `json:"start" bson:"start"`
	End   string `json:"end" bson:"end"`
}

func (i *Interval) ToString() string {
	return fmt.Sprintf("%s-%s", i.Start, i.End)
}

type OpeninHours struct {
	Monday    Interval `json:"monday" bson:"monday"`
	Tuesday   Interval `json:"tuesday" bson:"tuesday"`
	Wednesday Interval `json:"wednesday" bson:"wednesday"`
	Thursday  Interval `json:"thursday" bson:"thursday"`
	Friday    Interval `json:"friday" bson:"friday"`
	Saturday  Interval `json:"saturday" bson:"saturday"`
	Sunday    Interval `json:"sunday" bson:"sunday"`
}

func (o *OpeninHours) ToString() string {
	return fmt.Sprintf("%s;%s;%s;%s;%s;%s;%s",
		o.Monday.ToString(),
		o.Tuesday.ToString(),
		o.Wednesday.ToString(),
		o.Thursday.ToString(),
		o.Friday.ToString(),
		o.Saturday.ToString(),
		o.Sunday.ToString())
}
