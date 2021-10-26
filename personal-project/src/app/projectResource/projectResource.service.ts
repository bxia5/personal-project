import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";


const PROJECT_URL = environment.apiUrl + "/projects";
const RESOURCE_URL = environment.apiUrl + "/resources";
const COLUMN_URL = environment.apiUrl + "/project_columns";

@Injectable({providedIn: "root"})
export class ProjectResourceService{

  obj: any;
  resourceObj: any = null;
  projects: any;
  resources: any;
  allResources: any;
  projectId: any = null;
  project: any = "";
  projectColumns: any;
  columns: any;
  private resourceControl: Boolean = true;
  private projectStatusListener = new Subject<Boolean>();
  public sub: Subject<any> = new Subject();

  constructor(private http: HttpClient, private router: Router) {}

  getProjectStatusListener(){
    return this.projectStatusListener.asObservable();
  }

  private saveProjectData(projectId: string) {
    localStorage.setItem("projectId", projectId);
  }

  private clearProjectData() {
    localStorage.removeItem("projectId");
  }

  backToList(){
    this.projectId = null;
    this.projectStatusListener.next(false);
    this.clearProjectData();
    this.router.navigate(["/"]);
  }

  getProjects(userId: number){
    const queryPath = PROJECT_URL + "/allProjects?" + "userId=" + userId.toString();
    this.http.get(queryPath).subscribe(
      (res) =>{
        this.projects = res;
        //console.log(this.projects);
        this.sub.next(this.projects);
        //this.hasProject = true;
        },
        (error) => {}
    );
    //this.router.navigate(["/"]);
  }

  getAllResources(){
    this.http.get(RESOURCE_URL).subscribe(
      (res) =>{
        this.allResources = res;
        //console.log(this.projects);
        this.sub.next(this.allResources);
        //this.hasProject = true;
      },
      (error) => {}
    );
  }


  getResources(projectId: number){
    const resourcesQueryPath = PROJECT_URL + "/allResources?" + "projectId=" + projectId.toString();
    //this.resources = this.http.get(resourcesQueryPath).toPromise();
    this.http.get(resourcesQueryPath).subscribe(
      (res) =>{
        this.resources = res;
        this.sub.next(this.resources);
      },
      (error) => {this.resources = null}
    )
  }

  getProject(projectId: number){
    const queryPath = PROJECT_URL + "/project?" + "id=" + projectId.toString();

    this.http.get(queryPath).subscribe(
      (res) =>{
        this.project = res;
        if(this.resourceControl)
          this.getResources(projectId);
        //console.log(this.projects);
        //this.hasProject = true;
      },
      (error) => {}
    )
  }

  createResource(name: string, code: string){
    this.http.request('POST', RESOURCE_URL + "?name=" + name).subscribe(
      (res) => {
        this.resourceObj = res;
        let id = this.resourceObj[this.resourceObj.length - 1].id;
        this.resourceObj = null;
        console.log(id);
        this.http.request('PUT', RESOURCE_URL + "?name=" + name + "&id=" + id + "&code=" + code
        ).subscribe(
          (res) =>{
            this.getAllResources();
          },
          (error) =>{}
        );

      },
      (error) => {}
    )

  }


  createProject(userId: number, projectName: string){
    this.http.request('POST', PROJECT_URL  + "?" + "name=" + projectName).subscribe(
      (res) => {console.log("Success to create a project.");
        this.obj = res;
        this.http.request('POST', PROJECT_URL + "/assignProject" + "?" + "projectId=" + this.obj.id.toString() + "&userId=" + userId.toString())
          .subscribe(
            (res) => {console.log("Success to assign to the user");
              this.addResource(this.obj.id, 1);
              this.getProjects(userId);
              //this.sub.next(this.projects);
            },
            (error) => {}
          )
        },
      (error) => {}
    )
  }

  addResource(projectId:number, resourceId: number){
    this.http.request('POST', PROJECT_URL  + "/addResource?" + "projectId=" + projectId.toString() + "&resourceId=" + resourceId.toString()).subscribe(
      (res) => {
        if(this.resourceControl)
          this.getResources(projectId);
      },
      (error) => {}
    )
  }

  removeResource(projectId:number, resourceId: number){
    this.http.request('POST', PROJECT_URL  + "/removeResource?" + "projectId=" + projectId.toString() + "&resourceId=" + resourceId.toString()).subscribe(
      (res) => {
        if(this.resourceControl)
          this.getResources(projectId);
      },
      (error) => {}
    )
  }

  deleteProject(projectId: number, userId: number){
    const resourcesQueryPath = PROJECT_URL + "/allResources?" + "projectId=" + projectId.toString();
    //this.resources = this.http.get(resourcesQueryPath).toPromise();
    this.http.get(resourcesQueryPath).subscribe(
      (res) =>{
        let allR: any = res;
        this.resourceControl = false;
        for(let i = 1; i < allR.length; i++)
          this.removeResource(projectId, allR[i].id);

        this.removeResource(projectId, this.resources[0].id);

        const url = COLUMN_URL + "/project?id=" + projectId.toString();
        this.http.get(url).subscribe(
          (res) =>{
            let columnList: any = res;
            for(let i = 0; i < columnList.length; i++) {
                this.dropColumn(columnList[i].columnName);
              }
            this.http.request('DELETE', PROJECT_URL  + "?" + "id=" + projectId.toString()).subscribe(
              (res) => {
                this.resourceControl = true;
                console.log("Success to delete the project.");
                this.getProjects(userId);
              })
          })
      },
      (error) => {this.resources = null}
    )
  }

  getColumns(){
    this.http.get(COLUMN_URL).subscribe(
      (res) =>{
        this.columns = res;
      },
      (error) =>{}
    )
  }

  getProjectColumns(){
    const url = COLUMN_URL + "/project?id=" + this.projectId;
    this.http.get(url).subscribe(
      (res) =>{
        this.projectColumns = res;
      },
      (error) =>{}
    )
  }

  addProjectColumn(name: string, formula: string){
    this.http.request('POST', COLUMN_URL + "?name=" + name + "&formula=" + formula
    ).subscribe(
      res =>{
        let obj: any = res;
        const url = COLUMN_URL + "/assignColumn?projectId=" + this.projectId + "&columnId=" + obj.id.toString();
        this.http.request('Post', url).subscribe(
          res =>{
            this.getProjectColumns();
            this.getColumns();
          },
          error => {}
        )
      },
      error => {}
    )
  }

  addColumn(name: string, formula: string){
    this.http.request('POST', COLUMN_URL + "?name=" + name + "&formula=" + formula
    ).subscribe(
      res =>this.getColumns(),
      error => {}
    )
  }

  dropColumn(name: string){
      this.http.request('DELETE', COLUMN_URL + "?name=" + name).subscribe(
        res => {this.getColumns();
        if(this.projectId){
          this.getProjectColumns();
        }
        },
        error => {
        }
      )
  }

}
