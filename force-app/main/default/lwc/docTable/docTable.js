import { LightningElement, wire } from 'lwc';
import getDocumentRecords from '@salesforce/apex/DocumentController.getDocumentRecords';
import FuseJs from '@salesforce/resourceUrl/fuse'; // Import the static resource
import { loadScript } from 'lightning/platformResourceLoader';
import { refreshApex } from '@salesforce/apex';
export default class DocTable extends LightningElement {
    FuseJs = FuseJs;
    FuseJsFile = this.FuseJs + '/FuseJs/fuse.min.js';
    records = [];
    filteredRecords = [];
    fuse;
    searchKey = '';
    hasRendered = true;
    columns = [
        {
            label: 'Open Document Link',
            fieldName: 'DocumentLink',
            type: 'url',
            typeAttributes: {
                label: { fieldName: 'Name' },
                target: '_blank'
            }
        },
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Type', fieldName: 'Type', type: 'text' },
        { label: 'Date', fieldName: 'Date', type: 'date' }
    ];
    
    

    @wire(getDocumentRecords)
    wiredRecords({ error, data }) {
        if (data) {
            console.log('inside wire connected fuse list');
            this.records = data.map(record => ({
                id: record.Id,
                DocumentLink: `/${record.Id}`,
                Name: record.Name,
                Type: record.Type__c,
                Date: record.CreatedDate
            }));
            this.filteredRecords = this.records;
        } else if (error) {
            console.error('Error retrieving document records', error);
        }
    }

    renderedCallback() {
        console.log("in side render call back");
        //guarding code inside the renderedCallback using boolean property
        if (this.hasRendered) {
            this.hasRendered = false;
            Promise.all([
                loadScript(this, this.FuseJsFile) // Load the fuse.js script
            ])
            .then(() => {
                // console.log('search connected fuse list  = ',this.records);
                // console.log('fuse.js loaded successfully');
                const fuseOptions = {
                    keys: ['Name', 'Type', 'Date']
                };
                this.fuse = new Fuse(this.records, fuseOptions);
                
            })
            .catch(error => {
                console.error('Error loading fuse.js', error);
            });
            
        }
    }

    handleSearchChange(event) {
        const searchKey = event.target.value;
        this.filteredRecords = searchKey ? this.fuse.search(searchKey).map(result => result.item) : this.records;
    }

    handleRefresh(){
        refreshApex(wiredRecords)
    }
}
