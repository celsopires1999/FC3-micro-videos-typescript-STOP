import {
  CastMemberOutputMapper,
  ListCastMembersUseCase,
} from "#cast-member/application";
import {
  CastMember,
  CastMemberFakeBuilder,
  CastMemberRepository,
  Types,
} from "#cast-member/domain";
import { CastMemberInMemoryRepository } from "#cast-member/infra";

let repository: CastMemberInMemoryRepository;
let useCase: ListCastMembersUseCase.UseCase;

beforeEach(() => {
  repository = new CastMemberInMemoryRepository();
  useCase = new ListCastMembersUseCase.UseCase(repository);
});

describe("ListCastMembersUseCase Unit Tests", () => {
  test("toOutput method", () => {
    let result = new CastMemberRepository.SearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    let output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });

    const entity = CastMemberFakeBuilder.aCastMember().build();
    result = new CastMemberRepository.SearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [CastMemberOutputMapper.toOutput(entity)],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });
  });

  it("should return output with two cast members ordered by created_at when input is empty", async () => {
    const created_at = new Date();
    const faker = CastMemberFakeBuilder.aCastMember();

    const entities = [
      faker.withCreatedAt(created_at).build(),
      faker.withCreatedAt(new Date(created_at.getTime() + 1000)).build(),
    ];

    await repository.bulkInsert(entities);

    const output = await useCase.execute({});

    expect(output).toStrictEqual({
      items: [entities[1], entities[0]].map(CastMemberOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output with three cast members ordered by created_at when input is empty", async () => {
    const created_at = new Date();
    const faker = CastMemberFakeBuilder.aCastMember();

    const entities = [
      faker.withCreatedAt(created_at).build(),
      faker.withCreatedAt(new Date(created_at.getTime() + 1000)).build(),
      faker.withCreatedAt(new Date(created_at.getTime() + 3000)).build(),
    ];

    await repository.bulkInsert(entities);

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...entities].reverse().map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output using paginate, sort and filter", async () => {
    const entities = [
      CastMember.fake().anActor().withName("a").build(),
      CastMember.fake().aDirector().withName("AAA").build(),
      CastMember.fake().aDirector().withName("AaA").build(),
      CastMember.fake().anActor().withName("b").build(),
      CastMember.fake().anActor().withName("c").build(),
    ];

    await repository.bulkInsert(entities);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: { name: "a" },
    });
    expect(output).toStrictEqual({
      items: [entities[1], entities[2]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: { name: "a" },
    });
    expect(output).toStrictEqual({
      items: [entities[0]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: { name: "a" },
    });
    expect(output).toStrictEqual({
      items: [entities[0], entities[2]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });
    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: { type: Types.ACTOR },
    });
    expect(output).toStrictEqual({
      items: [entities[4], entities[3]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });
    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: { name: "aa", type: Types.DIRECTOR },
    });
    expect(output).toStrictEqual({
      items: [entities[2], entities[1]].map(CastMemberOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });
  });
});
