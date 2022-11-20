import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ResponseMessageType } from '../enums/responseMessageType.enum';
import { IPeopleModel } from '../models/people.model';
import { IStarshipModel } from '../models/starship.model';
import { IPeopleResponseModel } from './responseModels/peopleResponse.model';
import { IStarshipResponseModel } from './responseModels/starshipResponse.model';
import { SwapiService } from './swapi.service';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpMock: HttpTestingController;
  const swapiBaseUrl = 'https://www.swapi.tech/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(SwapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should call getPeopleById method and return mapped model object', waitForAsync(() => {
    // Arrange
    const id = 1;
    const mass = 1500;
    const description = 'TestDescription';

    const flushModel: IPeopleResponseModel = {
      message: ResponseMessageType.Ok,
      result: {
        __v: 1,
        _id: '2',
        description: description,
        properties: {
          mass: mass,
        },
        uid: id.toString(),
      }
    } as IPeopleResponseModel;

    const expectedResult: IPeopleModel = {
      description,
      mass,
      id: id.toString(),
    } as IPeopleModel;

    // Act & Assert
    service.getPeopleById(id)
      .subscribe((res) => {
        expect(res.description).toBe(expectedResult.description);
        expect(res.mass).toBe(expectedResult.mass);
        expect(res.id).toBe(expectedResult.id);
      });

    httpMock.expectOne({
      url: `${swapiBaseUrl}/people/${id}`,
      method: 'GET'
    }).flush(flushModel);
  }));

  it('should call getStarshipById method and return mapped model object', waitForAsync(() => {
    // Arrange
    const id = 1;
    const length = '1,400';
    const expectedLength = 1.400;
    const description = 'TestDescription';

    const flushModel: IStarshipResponseModel = {
      message: ResponseMessageType.Ok,
      result: {
        __v: 1,
        _id: '2',
        description: description,
        properties: {
          length,
        },
        uid: id.toString(),
      }
    } as IStarshipResponseModel;

    const expectedResult: IStarshipModel = {
      description,
      length: expectedLength,
      id: id.toString(),
    } as IStarshipModel;

    // Act & Assert
    service.getStarshipById(id)
      .subscribe((res) => {
        expect(res.description).toBe(expectedResult.description);
        expect(res.length).toBe(expectedResult.length);
        expect(res.id).toBe(expectedResult.id);
      });

    httpMock.expectOne({
      url: `${swapiBaseUrl}/starships/${id}`,
      method: 'GET'
    }).flush(flushModel);
  }));
})