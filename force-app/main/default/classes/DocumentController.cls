/**
 * @description       : 
 * @author            : Tarun E
 * @group             : 
 * @last modified on  : 09-22-2024
 * @last modified by  : Tarun E
**/
public with sharing class DocumentController {
    @AuraEnabled(cacheable=true)
    public static List<Document__c> getDocumentRecords() {
        return [SELECT Id, Name, Type__c, CreatedDate FROM Document__c LIMIT 10];
    }
}