import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";


const PROJECT_URL = environment.apiUrl + "/projects";
const RESOURCE_URL = environment.apiUrl + "/resources";



@Injectable({providedIn: "root"})
export class ProjectResourceService{

  resourcesReady: Boolean = false;
  obj: any;
  resourceObj: any = null;
  projects: any;
  resources: any;
  allResources: any;
  projectId: any = null;
  project: any = "";
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

  async deleteProject(projectId: number, userId: number){

    const resourcesQueryPath = PROJECT_URL + "/allResources?" + "projectId=" + projectId.toString();
    //this.resources = this.http.get(resourcesQueryPath).toPromise();
    this.http.get(resourcesQueryPath).subscribe(
      (res) =>{
        this.resources = res;
        while(this.resources.length > 1){
          this.removeResource(projectId, this.resources[0].id);
        }
        this.resourceControl = false;
        this.removeResource(projectId, this.resources[0].id);
  
        this.http.request('DELETE', PROJECT_URL  + "?" + "id=" + projectId.toString()).subscribe(
          (res) => {
            this.resourceControl = true;
           console.log("Success to delete the project.");
           this.getProjects(userId);
          }
        )
      },
      (error) => {this.resources = null}
    )
      
  }

}
