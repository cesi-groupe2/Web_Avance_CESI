// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package query

import (
	"context"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/schema"

	"gorm.io/gen"
	"gorm.io/gen/field"

	"gorm.io/plugin/dbresolver"

	"sqlDB/dao/model"
)

func newRestaurant(db *gorm.DB, opts ...gen.DOOption) restaurant {
	_restaurant := restaurant{}

	_restaurant.restaurantDo.UseDB(db, opts...)
	_restaurant.restaurantDo.UseModel(&model.Restaurant{})

	tableName := _restaurant.restaurantDo.TableName()
	_restaurant.ALL = field.NewAsterisk(tableName)
	_restaurant.IDRestaurant = field.NewInt32(tableName, "id_restaurant")
	_restaurant.Name = field.NewString(tableName, "name")
	_restaurant.Address = field.NewString(tableName, "address")
	_restaurant.Picture = field.NewBytes(tableName, "picture")
	_restaurant.LocalisationLatitude = field.NewFloat64(tableName, "localisation_latitude")
	_restaurant.LocalisationLongitude = field.NewFloat64(tableName, "localisation_longitude")
	_restaurant.Phone = field.NewString(tableName, "phone")
	_restaurant.OpeningHours = field.NewString(tableName, "opening_hours")

	_restaurant.fillFieldMap()

	return _restaurant
}

type restaurant struct {
	restaurantDo restaurantDo

	ALL                   field.Asterisk
	IDRestaurant          field.Int32
	Name                  field.String
	Address               field.String
	Picture               field.Bytes
	LocalisationLatitude  field.Float64
	LocalisationLongitude field.Float64
	Phone                 field.String
	OpeningHours          field.String

	fieldMap map[string]field.Expr
}

func (r restaurant) Table(newTableName string) *restaurant {
	r.restaurantDo.UseTable(newTableName)
	return r.updateTableName(newTableName)
}

func (r restaurant) As(alias string) *restaurant {
	r.restaurantDo.DO = *(r.restaurantDo.As(alias).(*gen.DO))
	return r.updateTableName(alias)
}

func (r *restaurant) updateTableName(table string) *restaurant {
	r.ALL = field.NewAsterisk(table)
	r.IDRestaurant = field.NewInt32(table, "id_restaurant")
	r.Name = field.NewString(table, "name")
	r.Address = field.NewString(table, "address")
	r.Picture = field.NewBytes(table, "picture")
	r.LocalisationLatitude = field.NewFloat64(table, "localisation_latitude")
	r.LocalisationLongitude = field.NewFloat64(table, "localisation_longitude")
	r.Phone = field.NewString(table, "phone")
	r.OpeningHours = field.NewString(table, "opening_hours")

	r.fillFieldMap()

	return r
}

func (r *restaurant) WithContext(ctx context.Context) *restaurantDo {
	return r.restaurantDo.WithContext(ctx)
}

func (r restaurant) TableName() string { return r.restaurantDo.TableName() }

func (r restaurant) Alias() string { return r.restaurantDo.Alias() }

func (r restaurant) Columns(cols ...field.Expr) gen.Columns { return r.restaurantDo.Columns(cols...) }

func (r *restaurant) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := r.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (r *restaurant) fillFieldMap() {
	r.fieldMap = make(map[string]field.Expr, 8)
	r.fieldMap["id_restaurant"] = r.IDRestaurant
	r.fieldMap["name"] = r.Name
	r.fieldMap["address"] = r.Address
	r.fieldMap["picture"] = r.Picture
	r.fieldMap["localisation_latitude"] = r.LocalisationLatitude
	r.fieldMap["localisation_longitude"] = r.LocalisationLongitude
	r.fieldMap["phone"] = r.Phone
	r.fieldMap["opening_hours"] = r.OpeningHours
}

func (r restaurant) clone(db *gorm.DB) restaurant {
	r.restaurantDo.ReplaceConnPool(db.Statement.ConnPool)
	return r
}

func (r restaurant) replaceDB(db *gorm.DB) restaurant {
	r.restaurantDo.ReplaceDB(db)
	return r
}

type restaurantDo struct{ gen.DO }

func (r restaurantDo) Debug() *restaurantDo {
	return r.withDO(r.DO.Debug())
}

func (r restaurantDo) WithContext(ctx context.Context) *restaurantDo {
	return r.withDO(r.DO.WithContext(ctx))
}

func (r restaurantDo) ReadDB() *restaurantDo {
	return r.Clauses(dbresolver.Read)
}

func (r restaurantDo) WriteDB() *restaurantDo {
	return r.Clauses(dbresolver.Write)
}

func (r restaurantDo) Session(config *gorm.Session) *restaurantDo {
	return r.withDO(r.DO.Session(config))
}

func (r restaurantDo) Clauses(conds ...clause.Expression) *restaurantDo {
	return r.withDO(r.DO.Clauses(conds...))
}

func (r restaurantDo) Returning(value interface{}, columns ...string) *restaurantDo {
	return r.withDO(r.DO.Returning(value, columns...))
}

func (r restaurantDo) Not(conds ...gen.Condition) *restaurantDo {
	return r.withDO(r.DO.Not(conds...))
}

func (r restaurantDo) Or(conds ...gen.Condition) *restaurantDo {
	return r.withDO(r.DO.Or(conds...))
}

func (r restaurantDo) Select(conds ...field.Expr) *restaurantDo {
	return r.withDO(r.DO.Select(conds...))
}

func (r restaurantDo) Where(conds ...gen.Condition) *restaurantDo {
	return r.withDO(r.DO.Where(conds...))
}

func (r restaurantDo) Order(conds ...field.Expr) *restaurantDo {
	return r.withDO(r.DO.Order(conds...))
}

func (r restaurantDo) Distinct(cols ...field.Expr) *restaurantDo {
	return r.withDO(r.DO.Distinct(cols...))
}

func (r restaurantDo) Omit(cols ...field.Expr) *restaurantDo {
	return r.withDO(r.DO.Omit(cols...))
}

func (r restaurantDo) Join(table schema.Tabler, on ...field.Expr) *restaurantDo {
	return r.withDO(r.DO.Join(table, on...))
}

func (r restaurantDo) LeftJoin(table schema.Tabler, on ...field.Expr) *restaurantDo {
	return r.withDO(r.DO.LeftJoin(table, on...))
}

func (r restaurantDo) RightJoin(table schema.Tabler, on ...field.Expr) *restaurantDo {
	return r.withDO(r.DO.RightJoin(table, on...))
}

func (r restaurantDo) Group(cols ...field.Expr) *restaurantDo {
	return r.withDO(r.DO.Group(cols...))
}

func (r restaurantDo) Having(conds ...gen.Condition) *restaurantDo {
	return r.withDO(r.DO.Having(conds...))
}

func (r restaurantDo) Limit(limit int) *restaurantDo {
	return r.withDO(r.DO.Limit(limit))
}

func (r restaurantDo) Offset(offset int) *restaurantDo {
	return r.withDO(r.DO.Offset(offset))
}

func (r restaurantDo) Scopes(funcs ...func(gen.Dao) gen.Dao) *restaurantDo {
	return r.withDO(r.DO.Scopes(funcs...))
}

func (r restaurantDo) Unscoped() *restaurantDo {
	return r.withDO(r.DO.Unscoped())
}

func (r restaurantDo) Create(values ...*model.Restaurant) error {
	if len(values) == 0 {
		return nil
	}
	return r.DO.Create(values)
}

func (r restaurantDo) CreateInBatches(values []*model.Restaurant, batchSize int) error {
	return r.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (r restaurantDo) Save(values ...*model.Restaurant) error {
	if len(values) == 0 {
		return nil
	}
	return r.DO.Save(values)
}

func (r restaurantDo) First() (*model.Restaurant, error) {
	if result, err := r.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*model.Restaurant), nil
	}
}

func (r restaurantDo) Take() (*model.Restaurant, error) {
	if result, err := r.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*model.Restaurant), nil
	}
}

func (r restaurantDo) Last() (*model.Restaurant, error) {
	if result, err := r.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*model.Restaurant), nil
	}
}

func (r restaurantDo) Find() ([]*model.Restaurant, error) {
	result, err := r.DO.Find()
	return result.([]*model.Restaurant), err
}

func (r restaurantDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*model.Restaurant, err error) {
	buf := make([]*model.Restaurant, 0, batchSize)
	err = r.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (r restaurantDo) FindInBatches(result *[]*model.Restaurant, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return r.DO.FindInBatches(result, batchSize, fc)
}

func (r restaurantDo) Attrs(attrs ...field.AssignExpr) *restaurantDo {
	return r.withDO(r.DO.Attrs(attrs...))
}

func (r restaurantDo) Assign(attrs ...field.AssignExpr) *restaurantDo {
	return r.withDO(r.DO.Assign(attrs...))
}

func (r restaurantDo) Joins(fields ...field.RelationField) *restaurantDo {
	for _, _f := range fields {
		r = *r.withDO(r.DO.Joins(_f))
	}
	return &r
}

func (r restaurantDo) Preload(fields ...field.RelationField) *restaurantDo {
	for _, _f := range fields {
		r = *r.withDO(r.DO.Preload(_f))
	}
	return &r
}

func (r restaurantDo) FirstOrInit() (*model.Restaurant, error) {
	if result, err := r.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*model.Restaurant), nil
	}
}

func (r restaurantDo) FirstOrCreate() (*model.Restaurant, error) {
	if result, err := r.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*model.Restaurant), nil
	}
}

func (r restaurantDo) FindByPage(offset int, limit int) (result []*model.Restaurant, count int64, err error) {
	result, err = r.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = r.Offset(-1).Limit(-1).Count()
	return
}

func (r restaurantDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = r.Count()
	if err != nil {
		return
	}

	err = r.Offset(offset).Limit(limit).Scan(result)
	return
}

func (r restaurantDo) Scan(result interface{}) (err error) {
	return r.DO.Scan(result)
}

func (r restaurantDo) Delete(models ...*model.Restaurant) (result gen.ResultInfo, err error) {
	return r.DO.Delete(models)
}

func (r *restaurantDo) withDO(do gen.Dao) *restaurantDo {
	r.DO = *do.(*gen.DO)
	return r
}
