// --------------------------------------------------------------------------------------------
// --- FF4j : Feature Flipping for Java
// --------------------------------------------------------------------------------------------
const chalk     	= require('chalk');
const generator 	= require('yeoman-generator');
const packagejs 	= require('../../package.json');


// Stores JHipster variables
const jhipsterVar 	= { moduleName: 'ff4j' };

// Stores JHipster functions
const jhipsterFunc 	= {};

//Stores JHipster functions
const jhipsterUtils = {};

// Constants
const TPL 					= 'template';
const FF4J_VERSION  		= '1.6.4';

// Functions available
module.exports = generator.extend( {

	// ----------------------------------------------------
    // Use compose Yeoman capability to maje jhipterVar available (like DB)
    // ----------------------------------------------------
    initializing: {
    	compose() {
            this.composeWith('jhipster:modules',   { 
            	jhipsterVar, 
            	jhipsterFunc,
            	jhipsterUtils},
                this.options.testmode ? { local: require.resolve('generator-jhipster/generators/modules') } : null
            );
        },
        displayLogo() {
            // Have Yeoman greet the user.
            this.log(`Welcome to the ${chalk.bold.yellow('JHipster ff4j')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
        }
    },
    
    // ----------------------------------------------------
    // Ask questions to user to set up the generator
    // ----------------------------------------------------
    prompting() {
        const done = this.async();
        const prompts = [
        	{    type: 'confirm',
                 name: 'ff4jInstall',
                 message: 'Do you want to install FF4j ?',
                 default: false   },
            {
                type: 'list',
                name: 'ff4jFeatureStore',
                message: 'Which database would you like to use to store *Features* ?',
                choices: [
                  {name: 'Same as Application', value: 'same'},
                  {name: 'Cassandra', value: 'cassandra'},
                  {name: 'ElasticSearch', value: 'elastic'},
                  {name: 'HazelCast', value: 'hazelCast'},
                  {name: 'HBase', value: 'hbase'},
                  {name: 'Ignite', value: 'ignite'},
                  {name: 'MongoDB', value: 'mongo'},
                  {name: 'Neo4j', value: 'neo4j'},
                  {name: 'Redis', value: 'neo4j'},
                  {name: 'SQL', value: 'sql'},
                  {name: 'XML', value: 'xml'},
                ],
                default: 'same' },/*
              {
                  type: 'list',
                  name: 'ff4jPropertyStore',
                  message: 'Which database would you like to use to store *Properties* ?',
                  choices: [
                    {name: 'Same as Application', value: 'same'},
                    {name: 'Same as FeatureStore', value: 'featureStore'},
                    {name: 'Archaius', value: 'cassandra'},
                    {name: 'Cassandra', value: 'cassandra'},
                    {name: 'Commons-config', value: 'commonsconf'},
                    {name: 'Consul', value: 'consul'},
                    {name: 'ElasticSearch', value: 'elastic'},
                    {name: 'HazelCast', value: 'hazelCast'},
                    {name: 'HBase', value: 'hbase'},
                    {name: 'Ignite', value: 'ignite'},
                    {name: 'MongoDB', value: 'mongo'},
                    {name: 'Neo4j', value: 'neo4j'},
                    {name: 'Redis', value: 'neo4j'},
                    {name: 'SQL', value: 'sql'},
                    {name: 'XML', value: 'xml'},
                  ],
                  default: 'same'
                },
                {
                    type: 'list',
                    name: 'ff4jEventRepository',
                    message: 'Which database would you like to use to store *AuditTrail* ?',
                    choices: [
                      {name: 'Same as Application', value: 'same'},
                      {name: 'Cassandra', value: 'cassandra'},
                      {name: 'ElasticSearch', value: 'elastic'},
                      {name: 'HazelCast', value: 'hazelCast'},
                      {name: 'HBase', value: 'hbase'},
                      {name: 'Ignite', value: 'ignite'},
                      {name: 'MongoDB', value: 'mongo'},
                      {name: 'Neo4j', value: 'neo4j'},
                      {name: 'Redis', value: 'neo4j'},
                      {name: 'SQL', value: 'sql'},
                    ],
                    default: 'same' },*/
        ];
        
        // After prompting, put variables in the context
        this.prompt(prompts).then((props) => {
            this.props = props;
            done();
        });
    },
    
    // -----------------------------------------
    // Copy Files to be used
    // -----------------------------------------
    writing() {
    	
    	this.log(`\n${chalk.bold.green('[jhipster-ff4j]')} - Starting `);

    	this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };
        
        this.copyFiles = function (files) {
            files.forEach( function(file) {
              jhipsterFunc.copyTemplate(file.from, file.to, 
            		  file.type? file.type: TPL, this, file.interpolate? { 'interpolate': file.interpolate } : undefined);
            }, this);
        };
        
        // Extract core information
        this.baseName 				= jhipsterVar.baseName;
        this.packageName 			= jhipsterVar.packageName;
        this.angularAppName 		= jhipsterVar.angularAppName;
        
        // Core config
        this.clientFramework 		= jhipsterVar.clientFramework;
        this.clientPackageManager 	= jhipsterVar.clientPackageManager;
        this.enableTranslation		= jhipsterVar.enableTranslation;
        
        // DataBase (used to setup ff4j as well)
        this.databaseType			= jhipsterVar.databaseType;
        this.devDatabaseType		= jhipsterVar.devDatabaseType;
        this.prodDatabaseType		= jhipsterVar.prodDatabaseType;
        
        // Path Config
        const javaDir 				= jhipsterVar.javaDir;
        const resourceDir 			= jhipsterVar.resourceDir;
        const webappDir 			= jhipsterVar.webappDir;
        this.javaDir 				= jhipsterVar.javaDir;
        this.resourceDir			= jhipsterVar.resourceDir;
        this.javaTemplateDir 		= 'src/main/java/package';
        this.message 				= this.props.message;
       
        // Update Dependencies
        if (jhipsterVar.buildTool === 'maven') {
            this.log(`${chalk.bold.green('[jhipster-ff4j]')} - Adding dependencies to Maven (pom.xml)`);
            jhipsterFunc.addMavenDependency('org.ff4j', 'ff4j-core', 			     FF4J_VERSION);
            jhipsterFunc.addMavenDependency('org.ff4j', 'ff4j-web', 				 FF4J_VERSION);
            jhipsterFunc.addMavenDependency('org.ff4j', 'ff4j-spring-services', 	 FF4J_VERSION);
            jhipsterFunc.addMavenDependency('org.ff4j', 'ff4j-spring-boot-web-api',  FF4J_VERSION);
            
        } else if (jhipsterVar.buildTool === 'gradle') {
            this.log(`${chalk.bold.green('[jhipster-ff4j]')} - Adding dependencies to Gradle`);
        	jhipsterFunc.addGradleDependency('org.ff4j', 'ff4j-core', 			 	 FF4J_VERSION);
            jhipsterFunc.addGradleDependency('org.ff4j', 'ff4j-web',  			 	 FF4J_VERSION);
            jhipsterFunc.addGradleDependency('org.ff4j', 'ff4j-spring-services', 	 FF4J_VERSION);
            jhipsterFunc.addGradleDependency('org.ff4j', 'ff4j-spring-boot-web-api', FF4J_VERSION);
        }
        
        // Copy Files (Java)
        files = [
            { from: this.javaTemplateDir + '/config/ff4j/_FF4jWebConfiguration.java',  to: this.javaDir + 'config/ff4j/FF4jWebConfiguration.java'},
            { from: this.javaTemplateDir + '/config/_SecurityCsrfRequestMatcher.java', to: this.javaDir + 'config/SecurityCsrfRequestMatcher.java'},
            { from: 'src/main/resources/ff4j.xml', to: this.resourceDir + 'ff4j.xml'}
          ];
        this.log(`${chalk.bold.green('[jhipster-ff4j]')} - Importing templates`);
        this.copyFiles(files);
        
        // Add link in WebPack
        this.log(`${chalk.bold.green('[jhipster-ff4j]')} - Updating Webpack`);
        jhipsterFunc.rewriteFile('webpack/webpack.dev.js', 'jhipster-needle-add-entity-to-webpack', "'/ff4j-web-console',");
        
        // Add Reference the Admin menu
        this.log(`${chalk.bold.green('[jhipster-ff4j]')} - Adding reference in the Admin Menu`);
    	if (this.clientFramework === 'angular1') {
        	jhipsterFunc.rewriteFile(
            		'src/main/webapp/app/layouts/navbar/navbar.html',
            		'jhipster-needle-add-element-to-admin-menu',
            		
            		'<li ui-sref-active="active">\n'+
            		' <a ui-sref="./ff4j-web-console/home?lang=en" ng-click="vm.collapseNavbar()">\n' +
            		'<span class="glyphicon glyphicon-toggle-on"></span>&nbsp;\n '+
            		'<span>Feature Toggle</span>\n'+
            		'</a> </li>\n');
        } else {
        	jhipsterFunc.rewriteFile(
             		'src/main/webapp/app/layouts/navbar/navbar.component.html',
             		'jhipster-needle-add-element-to-admin-menu',
             		
             		'<li> <a class="dropdown-item" href="./ff4j-web-console/home?lang=en" target="_tab" (click)="collapseNavbar()">\n'+
                    '  <i class="fa fa-fw fa-toggle-on" aria-hidden="true"></i>&nbsp;\n' +
                    '  <span>Feature Toggle</span>\n' +
                    ' </a>\n</li>');
        }
    	
    	// Update CSRF to allow request
    	this.log(`${chalk.bold.green('[jhipster-ff4j]')} - Updating security configuration`);
    	jhipsterFunc.replaceContent(this.javaDir + 'config/SecurityConfiguration.java', 
    			'.csrf()', 
    			'.csrf().requireCsrfProtectionMatcher(new SecurityCsrfRequestMatcher())');
    	// Secured access to the servlet
    	jhipsterFunc.replaceContent(this.javaDir + 'config/SecurityConfiguration.java', 
    			' .authorizeRequests()', 
    			' .authorizeRequests()\n            .antMatchers("/ff4j-web-console/**").hasAuthority(AuthoritiesConstants.ADMIN)');
        
    	// ----- KO ----
    	
    	// Should no be open 
    	//jhipsterFunc.replaceContent(this.javaDir + 'config/SecurityConfiguration.java', 
    	//		' .antMatchers("/app/**/*.{js,html}")', 
    	//		' .antMatchers("/app/**/*.{js,html}")\n            .antMatchers("/ff4j-web-console/**")');
    	
        // Is not a function....
        //jhipsterFunc.addEntityToWebpack('ff4j-web-console', this.enableTranslation, this.clientFramework);
        // It's not a rooter
        //jhipsterFunc.addElementToAdminMenu('ff4j-web-console', 'toggle-on', this.enableTranslation, this.clientFramework);
    },
    

    install() {
    	this.log(`install()`);
        let logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg =
                `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }
        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angular1',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        this.installDependencies(installConfig);
    },

    end() {
        this.log('End of ff4j generator');
    }
});


