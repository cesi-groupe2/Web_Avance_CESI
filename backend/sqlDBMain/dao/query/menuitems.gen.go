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

func newMenuitem(db *gorm.DB, opts ...gen.DOOption) menuitem {
	_menuitem := menuitem{}

	_menuitem.menuitemDo.UseDB(db, opts...)
	_menuitem.menuitemDo.UseModel(&model.Menuitem{})

	tableName := _menuitem.menuitemDo.TableName()
	_menuitem.ALL = field.NewAsterisk(tableName)
	_menuitem.IDMenuItem = field.NewInt32(tableName, "id_menu_item")
	_menuitem.Name = field.NewString(tableName, "name")
	_menuitem.Description = field.NewString(tableName, "description")
	_menuitem.Price = field.NewFloat64(tableName, "price")
	_menuitem.Image = field.NewString(tableName, "image")
	_menuitem.CreatedAt = field.NewTime(tableName, "created_at")
	_menuitem.IDRestaurant = field.NewInt32(tableName, "id_restaurant")

	_menuitem.fillFieldMap()

	return _menuitem
}

type menuitem struct {
	menuitemDo menuitemDo

	ALL          field.Asterisk
	IDMenuItem   field.Int32
	Name         field.String
	Description  field.String
	Price        field.Float64
	Image        field.String
	CreatedAt    field.Time
	IDRestaurant field.Int32

	fieldMap map[string]field.Expr
}

func (m menuitem) Table(newTableName string) *menuitem {
	m.menuitemDo.UseTable(newTableName)
	return m.updateTableName(newTableName)
}

func (m menuitem) As(alias string) *menuitem {
	m.menuitemDo.DO = *(m.menuitemDo.As(alias).(*gen.DO))
	return m.updateTableName(alias)
}

func (m *menuitem) updateTableName(table string) *menuitem {
	m.ALL = field.NewAsterisk(table)
	m.IDMenuItem = field.NewInt32(table, "id_menu_item")
	m.Name = field.NewString(table, "name")
	m.Description = field.NewString(table, "description")
	m.Price = field.NewFloat64(table, "price")
	m.Image = field.NewString(table, "image")
	m.CreatedAt = field.NewTime(table, "created_at")
	m.IDRestaurant = field.NewInt32(table, "id_restaurant")

	m.fillFieldMap()

	return m
}

func (m *menuitem) WithContext(ctx context.Context) *menuitemDo { return m.menuitemDo.WithContext(ctx) }

func (m menuitem) TableName() string { return m.menuitemDo.TableName() }

func (m menuitem) Alias() string { return m.menuitemDo.Alias() }

func (m menuitem) Columns(cols ...field.Expr) gen.Columns { return m.menuitemDo.Columns(cols...) }

func (m *menuitem) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := m.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (m *menuitem) fillFieldMap() {
	m.fieldMap = make(map[string]field.Expr, 7)
	m.fieldMap["id_menu_item"] = m.IDMenuItem
	m.fieldMap["name"] = m.Name
	m.fieldMap["description"] = m.Description
	m.fieldMap["price"] = m.Price
	m.fieldMap["image"] = m.Image
	m.fieldMap["created_at"] = m.CreatedAt
	m.fieldMap["id_restaurant"] = m.IDRestaurant
}

func (m menuitem) clone(db *gorm.DB) menuitem {
	m.menuitemDo.ReplaceConnPool(db.Statement.ConnPool)
	return m
}

func (m menuitem) replaceDB(db *gorm.DB) menuitem {
	m.menuitemDo.ReplaceDB(db)
	return m
}

type menuitemDo struct{ gen.DO }

func (m menuitemDo) Debug() *menuitemDo {
	return m.withDO(m.DO.Debug())
}

func (m menuitemDo) WithContext(ctx context.Context) *menuitemDo {
	return m.withDO(m.DO.WithContext(ctx))
}

func (m menuitemDo) ReadDB() *menuitemDo {
	return m.Clauses(dbresolver.Read)
}

func (m menuitemDo) WriteDB() *menuitemDo {
	return m.Clauses(dbresolver.Write)
}

func (m menuitemDo) Session(config *gorm.Session) *menuitemDo {
	return m.withDO(m.DO.Session(config))
}

func (m menuitemDo) Clauses(conds ...clause.Expression) *menuitemDo {
	return m.withDO(m.DO.Clauses(conds...))
}

func (m menuitemDo) Returning(value interface{}, columns ...string) *menuitemDo {
	return m.withDO(m.DO.Returning(value, columns...))
}

func (m menuitemDo) Not(conds ...gen.Condition) *menuitemDo {
	return m.withDO(m.DO.Not(conds...))
}

func (m menuitemDo) Or(conds ...gen.Condition) *menuitemDo {
	return m.withDO(m.DO.Or(conds...))
}

func (m menuitemDo) Select(conds ...field.Expr) *menuitemDo {
	return m.withDO(m.DO.Select(conds...))
}

func (m menuitemDo) Where(conds ...gen.Condition) *menuitemDo {
	return m.withDO(m.DO.Where(conds...))
}

func (m menuitemDo) Order(conds ...field.Expr) *menuitemDo {
	return m.withDO(m.DO.Order(conds...))
}

func (m menuitemDo) Distinct(cols ...field.Expr) *menuitemDo {
	return m.withDO(m.DO.Distinct(cols...))
}

func (m menuitemDo) Omit(cols ...field.Expr) *menuitemDo {
	return m.withDO(m.DO.Omit(cols...))
}

func (m menuitemDo) Join(table schema.Tabler, on ...field.Expr) *menuitemDo {
	return m.withDO(m.DO.Join(table, on...))
}

func (m menuitemDo) LeftJoin(table schema.Tabler, on ...field.Expr) *menuitemDo {
	return m.withDO(m.DO.LeftJoin(table, on...))
}

func (m menuitemDo) RightJoin(table schema.Tabler, on ...field.Expr) *menuitemDo {
	return m.withDO(m.DO.RightJoin(table, on...))
}

func (m menuitemDo) Group(cols ...field.Expr) *menuitemDo {
	return m.withDO(m.DO.Group(cols...))
}

func (m menuitemDo) Having(conds ...gen.Condition) *menuitemDo {
	return m.withDO(m.DO.Having(conds...))
}

func (m menuitemDo) Limit(limit int) *menuitemDo {
	return m.withDO(m.DO.Limit(limit))
}

func (m menuitemDo) Offset(offset int) *menuitemDo {
	return m.withDO(m.DO.Offset(offset))
}

func (m menuitemDo) Scopes(funcs ...func(gen.Dao) gen.Dao) *menuitemDo {
	return m.withDO(m.DO.Scopes(funcs...))
}

func (m menuitemDo) Unscoped() *menuitemDo {
	return m.withDO(m.DO.Unscoped())
}

func (m menuitemDo) Create(values ...*model.Menuitem) error {
	if len(values) == 0 {
		return nil
	}
	return m.DO.Create(values)
}

func (m menuitemDo) CreateInBatches(values []*model.Menuitem, batchSize int) error {
	return m.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (m menuitemDo) Save(values ...*model.Menuitem) error {
	if len(values) == 0 {
		return nil
	}
	return m.DO.Save(values)
}

func (m menuitemDo) First() (*model.Menuitem, error) {
	if result, err := m.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*model.Menuitem), nil
	}
}

func (m menuitemDo) Take() (*model.Menuitem, error) {
	if result, err := m.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*model.Menuitem), nil
	}
}

func (m menuitemDo) Last() (*model.Menuitem, error) {
	if result, err := m.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*model.Menuitem), nil
	}
}

func (m menuitemDo) Find() ([]*model.Menuitem, error) {
	result, err := m.DO.Find()
	return result.([]*model.Menuitem), err
}

func (m menuitemDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*model.Menuitem, err error) {
	buf := make([]*model.Menuitem, 0, batchSize)
	err = m.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (m menuitemDo) FindInBatches(result *[]*model.Menuitem, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return m.DO.FindInBatches(result, batchSize, fc)
}

func (m menuitemDo) Attrs(attrs ...field.AssignExpr) *menuitemDo {
	return m.withDO(m.DO.Attrs(attrs...))
}

func (m menuitemDo) Assign(attrs ...field.AssignExpr) *menuitemDo {
	return m.withDO(m.DO.Assign(attrs...))
}

func (m menuitemDo) Joins(fields ...field.RelationField) *menuitemDo {
	for _, _f := range fields {
		m = *m.withDO(m.DO.Joins(_f))
	}
	return &m
}

func (m menuitemDo) Preload(fields ...field.RelationField) *menuitemDo {
	for _, _f := range fields {
		m = *m.withDO(m.DO.Preload(_f))
	}
	return &m
}

func (m menuitemDo) FirstOrInit() (*model.Menuitem, error) {
	if result, err := m.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*model.Menuitem), nil
	}
}

func (m menuitemDo) FirstOrCreate() (*model.Menuitem, error) {
	if result, err := m.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*model.Menuitem), nil
	}
}

func (m menuitemDo) FindByPage(offset int, limit int) (result []*model.Menuitem, count int64, err error) {
	result, err = m.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = m.Offset(-1).Limit(-1).Count()
	return
}

func (m menuitemDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = m.Count()
	if err != nil {
		return
	}

	err = m.Offset(offset).Limit(limit).Scan(result)
	return
}

func (m menuitemDo) Scan(result interface{}) (err error) {
	return m.DO.Scan(result)
}

func (m menuitemDo) Delete(models ...*model.Menuitem) (result gen.ResultInfo, err error) {
	return m.DO.Delete(models)
}

func (m *menuitemDo) withDO(do gen.Dao) *menuitemDo {
	m.DO = *do.(*gen.DO)
	return m
}
