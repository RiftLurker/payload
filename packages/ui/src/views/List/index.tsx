import React, { Fragment } from 'react'

import type { DefaultListViewProps } from './types'

import './index.scss'
import { SelectionProvider } from './SelectionProvider'
import { Gutter } from '../../elements/Gutter'
import { getTranslation } from '@payloadcms/translations'
import Pill from '../../elements/Pill'
import { ListControls } from '../../elements/ListControls'
import { StaggeredShimmers } from '../../elements/ShimmerEffect'
import { RelationshipProvider } from './RelationshipProvider'
import Table from '../../elements/Table'
import { Button } from '../../elements/Button'
import { PerPage } from '../../elements/PerPage'
import { Pagination } from '../../elements/Pagination'
import ListSelection from '../../elements/ListSelection'
import EditMany from '../../elements/EditMany'
import PublishMany from '../../elements/PublishMany'
import UnpublishMany from '../../elements/UnpublishMany'
import DeleteMany from '../../elements/DeleteMany'
import { getTextFieldsToBeSearched } from '../../elements/ListControls/getTextFieldsToBeSearched'
import { SetStepNav } from '../../elements/StepNav/SetStepNav'
import buildColumns from '../../elements/TableColumns/buildColumns'
import getInitialColumnState from '../../elements/TableColumns/getInitialColumns'
import formatFields from './formatFields'

const baseClass = 'collection-list'

export const DefaultList: React.FC<DefaultListViewProps> = (props) => {
  const {
    config,
    collectionConfig,
    collectionConfig: {
      admin: {
        components: { AfterList, AfterListTable, BeforeList, BeforeListTable } = {},
        defaultColumns,
        listSearchableFields,
        useAsTitle,
      } = {},
      fields,
      labels: { plural: pluralLabel, singular: singularLabel } = {},
      slug: collectionSlug,
    },
    customHeader,
    data,
    handlePageChange,
    handlePerPageChange,
    handleSearchChange,
    handleSortChange,
    handleWhereChange,
    hasCreatePermission,
    limit,
    modifySearchParams,
    newDocumentURL,
    resetParams,
    titleField,
    i18n,
  } = props

  const textFieldsToBeSearched = getTextFieldsToBeSearched(listSearchableFields, fields)

  let docs = data.docs || []

  if (collectionConfig.upload) {
    docs = docs?.map((doc) => {
      return {
        ...doc,
        // filesize: formatFilesize(doc.filesize),
      }
    })
  }

  const formattedFields = formatFields(collectionConfig)

  const initialColumns = getInitialColumnState(formattedFields, useAsTitle, defaultColumns)

  const columns = buildColumns({
    cellProps: [],
    config,
    collectionConfig,
    i18n,
    columns: initialColumns.map((column) => ({
      accessor: column,
      active: true,
    })),
  })

  return (
    <div className={baseClass}>
      <SetStepNav
        nav={[
          {
            label: pluralLabel,
          },
        ]}
      />
      {Array.isArray(BeforeList) &&
        BeforeList.map((Component, i) => <Component key={i} {...props} />)}
      {/* <Meta title={getTranslation(collection.labels.plural, i18n)} /> */}
      <SelectionProvider docs={data.docs} totalDocs={data.totalDocs}>
        <Gutter className={`${baseClass}__wrap`}>
          <header className={`${baseClass}__header`}>
            {customHeader && customHeader}
            {!customHeader && (
              <Fragment>
                <h1>{getTranslation(pluralLabel, i18n)}</h1>
                {hasCreatePermission && (
                  <Pill
                    aria-label={i18n.t('general:createNewLabel', {
                      label: getTranslation(singularLabel, i18n),
                    })}
                    to={newDocumentURL}
                  >
                    {i18n.t('general:createNew')}
                  </Pill>
                )}
                {/* {!smallBreak && (
                  <ListSelection label={getTranslation(collection.labels.plural, i18n)} />
                )} */}
                {/* {description && (
                  <div className={`${baseClass}__sub-header`}>
                    <ViewDescription description={description} />
                  </div>
                )} */}
              </Fragment>
            )}
          </header>
          <ListControls
            collectionPluralLabel={pluralLabel}
            collectionSlug={collectionSlug}
            textFieldsToBeSearched={textFieldsToBeSearched}
            // handleSearchChange={handleSearchChange}
            // handleSortChange={handleSortChange}
            // handleWhereChange={handleWhereChange}
            // modifySearchQuery={modifySearchParams}
            // resetParams={resetParams}
            titleField={titleField}
          />
          {Array.isArray(BeforeListTable) &&
            BeforeListTable.map((Component, i) => <Component key={i} {...props} />)}
          {!data.docs && (
            <StaggeredShimmers
              className={[`${baseClass}__shimmer`, `${baseClass}__shimmer--rows`].join(' ')}
              count={6}
            />
          )}
          {data.docs && data.docs.length > 0 && (
            <RelationshipProvider>
              <Table data={docs} columns={columns} />
            </RelationshipProvider>
          )}
          {data.docs && data.docs.length === 0 && (
            <div className={`${baseClass}__no-results`}>
              <p>{i18n.t('general:noResults', { label: getTranslation(pluralLabel, i18n) })}</p>
              {hasCreatePermission && newDocumentURL && (
                <Button el="link" to={newDocumentURL}>
                  {i18n.t('general:createNewLabel', { label: getTranslation(singularLabel, i18n) })}
                </Button>
              )}
            </div>
          )}
          {Array.isArray(AfterListTable) &&
            AfterListTable.map((Component, i) => <Component key={i} {...props} />)}
          {data.docs && data.docs.length > 0 && (
            <div className={`${baseClass}__page-controls`}>
              <Pagination
                disableHistoryChange={modifySearchParams === false}
                hasNextPage={data.hasNextPage}
                hasPrevPage={data.hasPrevPage}
                limit={data.limit}
                nextPage={data.nextPage}
                numberOfNeighbors={1}
                onChange={handlePageChange}
                page={data.page}
                prevPage={data.prevPage}
                totalPages={data.totalPages}
              />
              {data?.totalDocs > 0 && (
                <Fragment>
                  <div className={`${baseClass}__page-info`}>
                    {data.page * data.limit - (data.limit - 1)}-
                    {data.totalPages > 1 && data.totalPages !== data.page
                      ? data.limit * data.page
                      : data.totalDocs}{' '}
                    {i18n.t('general:of')} {data.totalDocs}
                  </div>
                  <PerPage
                    handleChange={handlePerPageChange}
                    limit={limit}
                    limits={collectionConfig?.admin?.pagination?.limits}
                    modifySearchParams={modifySearchParams}
                    resetPage={data.totalDocs <= data.pagingCounter}
                  />
                  {/* {smallBreak && (
                    <div className={`${baseClass}__list-selection`}>
                      <Fragment>
                        <ListSelection label={getTranslation(collection.labels.plural, i18n)} />
                        <div className={`${baseClass}__list-selection-actions`}>
                          <EditMany resetParams={resetParams} />
                          <PublishMany resetParams={resetParams} />
                          <UnpublishMany resetParams={resetParams} />
                          <DeleteMany resetParams={resetParams} />
                        </div>
                      </Fragment>
                    </div>
                  )} */}
                </Fragment>
              )}
            </div>
          )}
        </Gutter>
      </SelectionProvider>
      {Array.isArray(AfterList) &&
        AfterList.map((Component, i) => <Component key={i} {...props} />)}
    </div>
  )
}